package com.foodagram.content.service;

import com.foodagram.content.mapper.CommentVoteMapper;
import com.foodagram.content.repository.CommentRepository;
import com.foodagram.content.repository.CommentVoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentVoteService {
    private final CommentVoteRepository commentVoteRepository;
    private final CommentRepository commentRepository;
    private final CommentVoteMapper commentVoteMapper;


} 
