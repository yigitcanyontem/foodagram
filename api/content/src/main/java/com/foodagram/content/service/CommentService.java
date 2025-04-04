package com.foodagram.content.service;

import com.foodagram.content.mapper.CommentMapper;
import com.foodagram.content.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

}
