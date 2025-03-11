package com.foodagram.auth.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
//import com.foodagram.clients.cache.CacheClient;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersDetailsService implements UserDetailsService {

    private final UsersClient usersClient;
//    private final CacheClient cacheClient;

    @Override
    public UsersPrincipal loadUserByUsername(String email) throws BadCredentialsException, AccessDeniedException {
        UsersDto user = null;

        try {
//            user = cacheClient.getUserByEmail(email).getBody();
        }catch (Exception e){
            log.error("Error while fetching user from cache: {}", e.getMessage());
        }
        if (user == null) {
            user = usersClient.getUserByEmail(email).getBody();
        }

        if (user == null) {
            log.info("User not found with email: {}", email);
            return null;
        }

        return new UsersPrincipal(user);
    }
}
