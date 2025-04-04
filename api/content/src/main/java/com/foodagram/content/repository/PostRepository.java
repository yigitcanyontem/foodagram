package com.foodagram.content.repository;

import com.foodagram.content.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findByUserId(UUID userId);
    List<Post> findByUserIdAndVisibility(UUID userId, String visibility);
    List<Post> findByTagsContaining(String tag);
} 