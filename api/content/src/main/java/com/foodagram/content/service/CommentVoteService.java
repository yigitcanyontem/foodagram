package com.foodagram.content.service;

import com.foodagram.clients.content.dto.*;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.domain.Comment;
import com.foodagram.content.domain.CommentVote;
import com.foodagram.content.repository.CommentVoteRepository;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentVoteService {
    private final CommentVoteRepository commentVoteRepository;

    public CommentVoteResponseDto createCommentVote(CommentVoteCreateDto commentVoteCreateDto, UUID userId) {
        CommentVote commentVote = CommentVote.builder()
                .comment(Comment.builder().id(commentVoteCreateDto.getCommentId()).build())
                .userId(userId)
                .voteType(commentVoteCreateDto.getVoteType())
                .build();
        return mapToResponseDto(commentVoteRepository.save(commentVote));
    }

    public CommentVoteResponseDto getCommentVoteById(UUID id) {
        CommentVote commentVote = commentVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CommentVote not found with id: " + id));
        return mapToResponseDto(commentVote);
    }

    public void deleteCommentVote(UUID id, UsersDto user) {
        CommentVote vote = commentVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CommentVote not found with id: " + id));

        throwIfUserIsNotOwnerOfComment(vote.getUserId(), user.getId());

        commentVoteRepository.deleteById(id);
    }

    private CommentVoteResponseDto mapToResponseDto(CommentVote commentVote) {
        return CommentVoteResponseDto.builder()
                .id(commentVote.getId())
                .commentId(commentVote.getComment().getId())
                .userId(commentVote.getUserId())
                .voteType(commentVote.getVoteType())
                .createdAt(commentVote.getCreatedDate())
                .updatedAt(commentVote.getUpdatedDate())
                .build();
    }

    private void throwIfUserIsNotOwnerOfComment(UUID userId, UUID creatorId) {
        if (!userId.equals(creatorId)) {
            throw new ForbiddenException("You are not owner of this comment vote");
        }
    }

    public List<CommentVoteResponseDto> getCommentVotesByComment(UUID commentId) {
        return commentVoteRepository.findByCommentId(commentId).stream().map(this::mapToResponseDto).toList();

    }
}
