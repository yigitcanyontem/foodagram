package com.foodagram.content.util;

import com.foodagram.clients.auth.AuthClient;
import com.foodagram.clients.users.dto.UsersDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersUtil {
    private final AuthClient authClient;

    public UsersDto throwIfJwtTokenIsInvalidElseReturnUser(String jwtToken) {
        UsersDto user = authClient.validateToken(jwtToken).getBody();

        if (user == null) {
            throw new IllegalArgumentException("Invalid JWT token");
        }

        return user;
    }
}
