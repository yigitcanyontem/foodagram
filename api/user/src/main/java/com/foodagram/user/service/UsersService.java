package com.foodagram.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.foodagram.amqp.RabbitMQMessageProducer;
import com.foodagram.clients.auth.AuthClient;
import com.foodagram.clients.users.dto.UserRegisterDTO;
import com.foodagram.clients.users.dto.UsersCompleteDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.user.domain.Users;
import com.foodagram.user.repository.UsersRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UsersService {
    private final UsersRepository usersRepository;
    private final RabbitMQMessageProducer rabbitMQMessageProducer;
    private final AuthClient authClient;
    private final UsersProfileService usersProfileService;

    public UsersDto getUsersByUsername(String username) {
        Users user = usersRepository.findByUsername(username);
        return new UsersDto().builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .createdDate(user.getCreatedDate())
                .build();
    }

    public UsersDto getUserByEmail(String email) {
        Users user = usersRepository.findByEmail(email);
        return new UsersDto().builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .createdDate(user.getCreatedDate())
                .build();
    }

    public UsersDto getUserById(UUID id) {
        Users user = usersRepository.findById(id).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        return new UsersDto().builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .createdDate(user.getCreatedDate())
                .build();
    }

    public UsersDto save(UsersDto user) {
        Users newUser = Users.builder()
                .username(user.getUsername().toLowerCase())
                .email(user.getEmail().toLowerCase())
                .role(user.getRole())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .build();
        newUser = usersRepository.saveAndFlush(newUser);
        user.setId(newUser.getId());

        usersProfileService.createDefaultProfile(newUser.getId());

        return user;
    }

    public boolean userExists(UserRegisterDTO user) {
        return usersRepository.existsByEmailOrUsername(user.getEmail().toLowerCase(), user.getUsername().toLowerCase());
    }

    public UsersCompleteDto getLoggedInUser(String jwtToken) {
        UsersDto usersDto = authClient.validateToken(jwtToken).getBody();

        if (usersDto == null) {
            throw new RuntimeException("User not found");
        }

        UsersProfileDto usersProfileDto = usersProfileService.getUsersProfileByUsersId(usersDto.getId());
        usersDto.setPassword(null);
        return new UsersCompleteDto(usersDto, usersProfileDto);
    }

    public List<UsersCompleteDto> getAllUsers(String jwtToken) {
        UsersDto loggedusersDto = authClient.validateToken(jwtToken).getBody();
        if (loggedusersDto == null || !loggedusersDto.getRole().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized");
        }

        List<UsersCompleteDto> completeDtos = new ArrayList<>();

        List<UsersDto> usersDtos = usersRepository.findAll()
                .stream()
                .map(user -> new UsersDto().builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdDate(user.getCreatedDate())
                .build()).toList();

        for (UsersDto usersDto : usersDtos) {
            UsersProfileDto usersProfileDto = usersProfileService.getUsersProfileByUsersId(usersDto.getId());
            usersDto.setPassword(null);
            completeDtos.add(new UsersCompleteDto(usersDto, usersProfileDto));
        }
        return completeDtos;
    }

    public void deleteUser(UUID id, String jwtToken) {
        // Validate token and check if user has permission to delete
        UsersDto usersDto = authClient.validateToken(jwtToken).getBody();
        if (usersDto == null || !usersDto.getRole().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized");
        }

        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete user profile first
        //TODO: Check if user has posts and delete them first
//        usersProfileService.deleteUsersProfile(user.getId());

        // Delete user
        usersRepository.delete(user);
    }
}
