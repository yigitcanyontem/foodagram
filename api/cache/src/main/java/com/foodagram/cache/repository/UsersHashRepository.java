package com.foodagram.cache.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.foodagram.cache.hash.UsersHash;

import java.util.Optional;

@Repository
public interface UsersHashRepository extends CrudRepository<UsersHash, String >{
    Optional<UsersHash> findByEmail(String email);

    void deleteByEmail(String email);
}
