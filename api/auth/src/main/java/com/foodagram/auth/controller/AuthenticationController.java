package com.foodagram.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.foodagram.auth.security.AuthenticationService;
import com.foodagram.clients.users.dto.AuthenticationRequest;
import com.foodagram.clients.users.dto.AuthenticationResponse;
import com.foodagram.clients.users.dto.UserRegisterDTO;
import com.foodagram.clients.users.dto.UsersDto;

import javax.security.auth.login.LoginException;

@Slf4j
@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) throws LoginException {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody UserRegisterDTO request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/validate-token")
    public ResponseEntity<UsersDto> validateToken(@RequestParam("token") String token) {
        return ResponseEntity.ok(authenticationService.validateToken(token));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        // Retrieve cookies from the request
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshToken = cookie.getValue();
                    // Use the refresh token to get a new access token
                    AuthenticationResponse authResponse = authenticationService.refreshToken(refreshToken);

                    // Optionally, reset the cookie if needed
                    Cookie newCookie = new Cookie("refreshToken", refreshToken);
                    newCookie.setPath("/api/refresh-token");
                    newCookie.setHttpOnly(true);
                    newCookie.setSecure(true);  // Only send over HTTPS
                    newCookie.setMaxAge(60 * 60 * 24 * 7); // Example: 1 week expiration
                    response.addCookie(newCookie);

                    return ResponseEntity.ok(authResponse);
                }
            }
        }
        // Handle the case where the cookie is not found
        return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).build();
    }
}
