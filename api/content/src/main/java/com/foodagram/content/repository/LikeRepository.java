package com.foodagram.content.repository;

import com.foodagram.content.domain.Like;
import com.foodagram.content.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, UUID> {
    Optional<Like> findByUserIdAndPostId(UUID userId, UUID postId);
    long countByPostId(UUID postId);
    void deleteByUserIdAndPostId(UUID userId, UUID postId);

    List<Like> findByPostId(UUID postId);
}
