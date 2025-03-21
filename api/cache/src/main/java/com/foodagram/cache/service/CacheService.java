package com.foodagram.cache.service;

import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.foodagram.cache.hash.UsersHash;
import com.foodagram.cache.repository.UsersHashRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheService{
    private final UsersHashRepository usersHashRepository;

    // Fetching users with caching
    public UsersDto getUserByEmail(String email) {
        Optional<UsersHash> usersHash = usersHashRepository.findByEmail(email);

        return usersHash.map(hash -> new UsersDto(
                hash.getId(),
                hash.getUsername(),
                hash.getEmail(),
                hash.getPassword(),
                Role.valueOf(hash.getRole()),
                hash.isEnabled(),
                hash.getCreatedAt()
        )).orElse(null);
    }

    // Adding or updating a user and updating cache
    public void saveOrUpdateUser(UsersDto user) {
        UsersHash usersHash = usersHashRepository.save(new UsersHash(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getRole().toString(),
                user.isEnabled(),
                user.getCreatedAt()
        ));
        log.info("User saved with id: {}", usersHash.getId());
    }

    // Deleting user from the cache and repository
    public void deleteUserByEmail(String email) {
        usersHashRepository.deleteByEmail(email);
        log.info("User deleted with email: {}", email);
    }
}
