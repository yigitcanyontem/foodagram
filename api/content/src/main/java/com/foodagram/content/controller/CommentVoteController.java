package com.foodagram.content.controller;

import com.foodagram.content.service.CommentVoteService;
import com.foodagram.content.util.UsersUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comment-votes")
@RequiredArgsConstructor
public class CommentVoteController {
    private final CommentVoteService commentVoteService;
    private final UsersUtil usersUtil;

} 
