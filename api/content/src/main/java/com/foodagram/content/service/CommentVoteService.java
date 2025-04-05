package com.foodagram.content.service;

import com.foodagram.content.domain.CommentVote;
import com.foodagram.clients.content.dto.CommentVoteCreateDto;
import com.foodagram.clients.content.dto.CommentVoteResponseDto;
import com.foodagram.content.repository.CommentVoteRepository;
import com.foodagram.content.util.UsersUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentVoteService {
    private final CommentVoteRepository commentVoteRepository;
    private final UsersUtil usersUtil;
//
//    @Transactional
//    public CommentVoteResponseDto createCommentVote(CommentVoteCreateDto commentVoteCreateDto) {
//        CommentVote commentVote = CommentVote.builder()
//                .commentId(commentVoteCreateDto.getCommentId())
//                .userId(usersUtil.getCurrentUserId())
//                .voteType(commentVoteCreateDto.getVoteType())
//                .build();
//        return mapToResponseDto(commentVoteRepository.save(commentVote));
//    }
//
//    public CommentVoteResponseDto getCommentVote(UUID id) {
//        return mapToResponseDto(findCommentVoteById(id));
//    }
//
//    public List<CommentVoteResponseDto> getCommentVotesByCommentId(UUID commentId) {
//        return commentVoteRepository.findByCommentId(commentId).stream()
//                .map(this::mapToResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public void deleteCommentVote(UUID id) {
//        commentVoteRepository.deleteById(id);
//    }
//
//    private CommentVote findCommentVoteById(UUID id) {
//        return commentVoteRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("CommentVote not found with id: " + id));
//    }
//
//    private CommentVoteResponseDto mapToResponseDto(CommentVote commentVote) {
//        return CommentVoteResponseDto.builder()
//                .id(commentVote.getId())
//                .commentId(commentVote.getComment().getId())
//                .userId(commentVote.getUserId())
//                .voteType(commentVote.getVoteType())
//                .createdAt(commentVote.getCreatedAt())
//                .updatedAt(commentVote.getUpdatedAt())
//                .build();
//    }
} 
