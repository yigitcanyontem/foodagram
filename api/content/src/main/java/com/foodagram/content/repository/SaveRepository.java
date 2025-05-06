package com.foodagram.content.repository;

import com.foodagram.content.domain.Like;
import com.foodagram.content.domain.Save;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SaveRepository extends JpaRepository<Save, UUID> {
    Optional<Save> findByUserIdAndPostId(UUID userId, UUID postId);
    long countByPostId(UUID postId);
    void deleteByUserIdAndPostId(UUID userId, UUID postId);

    List<Save> findByPostId(UUID postId);

    List<Save> findByUserId(UUID userId);

    void deleteAllByPost_Id(UUID postİd);
}
