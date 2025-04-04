package com.foodagram.content.repository;

import com.foodagram.content.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByPostId(UUID postId);
    List<Comment> findByUserId(UUID userId);
    List<Comment> findByParentReplyId(UUID parentReplyId);
} 