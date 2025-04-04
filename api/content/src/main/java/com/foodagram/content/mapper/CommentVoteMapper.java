package com.foodagram.content.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentVoteMapper {

//    public CommentVoteDTO toDTO(CommentVote vote) {
//        if (vote == null) return null;
//
//        return CommentVoteDTO.builder()
//                .id(vote.getId())
//                .commentId(vote.getComment().getId())
//                .userId(vote.getUserId())
//                .voteType(vote.getVoteType())
//                .createdAt(vote.getCreatedDate())
//                .updatedAt(vote.getUpdatedDate())
//                .build();
//    }
//
//    public CommentVote toDomain(CommentVoteDTO dto) {
//        if (dto == null) return null;
//
//        return CommentVote.builder()
//                .id(dto.getId())
//                .userId(dto.getUserId())
//                .voteType(dto.getVoteType())
//                .build();
//    }
//
//    public List<CommentVoteDTO> toDTOList(List<CommentVote> votes) {
//        if (votes == null) return null;
//        return votes.stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
} 
