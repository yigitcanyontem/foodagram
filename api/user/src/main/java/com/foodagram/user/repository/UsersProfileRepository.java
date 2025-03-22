package com.foodagram.user.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.foodagram.user.domain.UsersProfile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersProfileRepository extends JpaRepository<UsersProfile, UUID> {
    Optional<UsersProfile> findUsersProfileByUsersIdEmail(String email);

    Optional<UsersProfile> findUsersProfileByUsersIdId(UUID usersId_id);

    boolean existsByUsersIdId(UUID usersId_id);

    void deleteByUsersIdId(UUID id);

    Page<UsersProfile> findAllByUsersId_UsernameContaining(String query, Pageable pageable);
}
