package com.foodagram.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.foodagram.auth.domain.Token;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {

    List<Token> findAllValidTokenByUserId(Integer id);


    Optional<Token> findByToken(String token);
  Token findTokenByToken(String token);
}
