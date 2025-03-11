package com.foodagram.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.foodagram.user.domain.UsersProfile;

import java.util.Optional;

@Repository
public interface UsersProfileRepository extends JpaRepository<UsersProfile, Integer> {
    Optional<UsersProfile> findUsersProfileByUsersIdEmail(String email);
    Optional<UsersProfile> findUsersProfileByUsersIdId(Integer usersId_id);

    boolean existsByUsersIdId(Integer usersId_id);

    void deleteByUsersIdId(Integer id);
}
