package com.foodagram.auth.security;

import com.foodagram.validator.validators.user.UserValidator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.foodagram.amqp.RabbitMQMessageProducer;
import com.foodagram.auth.domain.Token;
import com.foodagram.auth.repository.TokenRepository;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.AuthenticationRequest;
import com.foodagram.clients.users.dto.AuthenticationResponse;
import com.foodagram.clients.users.dto.UserRegisterDTO;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.enums.Role;
import com.foodagram.clients.users.enums.TokenType;

import javax.security.auth.login.LoginException;
import java.util.Date;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);
    private final UsersClient usersClient;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final UsersDetailsService userDetailsService;
    private final RabbitMQMessageProducer rabbitMQMessageProducer;

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws LoginException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername().toLowerCase(),
                        request.getPassword()
                )
        );

        UsersDto user = usersClient.getUserByEmail(request.getUsername().toLowerCase()).getBody();
        if (!user.isEnabled()){
            throw new LoginException("Account doesn't exist");
        }

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        saveUserToken(user, refreshToken);
        saveUserToCache(user);
        user.setPassword(null);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(user)
                .build();
    }

    public AuthenticationResponse authenticateAdmin(AuthenticationRequest request) throws LoginException {
        AuthenticationResponse response = authenticate(request);
        if (!response.getUser().getRole().equals(Role.ADMIN)){
            throw new LoginException("You are not an admin");
        }
        return response;
    }

    private void saveUserToken(UsersDto user, String jwtToken) {
        var token = Token.builder()
                .userId(user.getId())
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(UsersDto user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUserId(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public AuthenticationResponse register(UserRegisterDTO request) {
        boolean userExists = usersClient.userExists(request);

        if (userExists) {
            throw new IllegalArgumentException("User already exists");
        }

        UserValidator.throwIfRegisterPayloadInvalid(request);

        UsersDto user = UsersDto.builder()
                .email(request.getEmail().toLowerCase())
                .username(request.getUsername().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .createdDate(LocalDateTime.now())
                .build();
        UsersDto savedUser = usersClient.save(user).getBody();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        saveUserToken(savedUser, refreshToken);
        saveUserToCache(savedUser);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(savedUser)
                .build();
    }

    public UsersDto validateToken(String token) {
        token = token.replace("Bearer ", "");
        token = token.replace("Basic ", "");
        String username = jwtService.extractUsername(token);
        UsersPrincipal userDetails = userDetailsService.loadUserByUsername(username);
        if (jwtService.validateToken(token, userDetails)) {
            userDetails.user().setPassword(null);
            return userDetails.user();
        } else {
            return null;
        }
    }

    private void saveUserToCache(UsersDto user) {
        try {
            rabbitMQMessageProducer.publish(user,
                    "internal.exchange",
                    "internal.cache.routing-key"
            );
        }catch (Exception e){
            log.error("Error while saving user to cache", e);
        }
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        refreshToken = refreshToken.replace("Bearer ", "");
        String username = jwtService.extractUsername(refreshToken);
        UsersPrincipal userDetails = userDetailsService.loadUserByUsername(username);
        if (jwtService.validateToken(refreshToken, userDetails)) {
            var jwtToken = jwtService.generateToken(userDetails.user());
            var newRefreshToken = jwtService.generateRefreshToken(userDetails.user());
            revokeAllUserTokens(userDetails.user());
            saveUserToken(userDetails.user(), jwtToken);
            saveUserToCache(userDetails.user());
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(newRefreshToken)
                    .user(userDetails.user())
                    .build();
        } else {
            return null;
        }
    }
}
