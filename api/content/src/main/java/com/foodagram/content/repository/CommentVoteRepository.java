package com.foodagram.content.repository;

import com.foodagram.content.domain.CommentVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentVoteRepository extends JpaRepository<CommentVote, UUID> {
    List<CommentVote> findByCommentId(UUID commentId);
    List<CommentVote> findByUserId(UUID userId);
    Optional<CommentVote> findByCommentIdAndUserId(UUID commentId, UUID userId);
} 