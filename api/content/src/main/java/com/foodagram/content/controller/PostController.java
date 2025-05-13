package com.foodagram.content.controller;

import com.foodagram.clients.content.dto.PostCreateDto;
import com.foodagram.clients.content.dto.PostResponseDto;
import com.foodagram.clients.content.dto.PostUpdateDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.content.service.LikeService;
import com.foodagram.content.service.PostService;
import com.foodagram.content.service.SaveService;
import com.foodagram.content.util.UsersUtil;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {
    private final PostService postService;
    private final UsersUtil usersUtil;
    private final LikeService likeService;
    private final SaveService saveService;

    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody PostCreateDto postCreateDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            postCreateDto.setUserId(user.getId());
            return ResponseEntity.ok(postService.createPost(postCreateDto));
        } catch (Exception e) {
            log.error("Error while creating post: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID id) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(postService.getPost(id, user));
        } catch (Exception e) {
            log.error("Error while fetching post: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDto>> getAllPostsByUser(@PathVariable UUID userId,@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(postService.getAllPostsByUser(userId, user));
        } catch (Exception e) {
            log.error("Error while fetching post by user: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/explore")
        public ResponseEntity<Page<PostResponseDto>> getRandomPublicPostsForExplore(
                @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size
        ) {
            try {
                UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
                Page<PostResponseDto> explorePosts = postService.getRandomPublicPostsForExplore(user.getId(), page, size);
                return ResponseEntity.ok(explorePosts);
            } catch (Exception e) {
                log.error("Error while fetching explore posts: {}", e.getMessage());
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }


    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> updatePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID id, @RequestBody PostUpdateDto postUpdateDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(postService.updatePost(id, postUpdateDto, user));
        } catch (Exception e) {
            log.error("Error while updating post by user: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID id) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            postService.deletePost(id, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while deleting post by user: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/likes/{postId}")
    public ResponseEntity<Void> likePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID postId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            likeService.likePost(user.getId(), postId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while liking post : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/likes/{postId}")
    public ResponseEntity<Void> unlikePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID postId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            likeService.unlikePost(user.getId(), postId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while removing liking post : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/likes/{postId}")
    public ResponseEntity<Boolean> hasUserLikedPost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID postId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(likeService.hasUserLikedPost(user.getId(), postId));
        } catch (Exception e) {
            log.error("Error while fetching liked post : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/likes/users/{postId}")
    public ResponseEntity<List<UsersProfileDto>> getUsersWhoLikedPost(@PathVariable UUID postId) {
        try {
            return ResponseEntity.ok(likeService.getUsersWhoLikedPost(postId));
        } catch (Exception e) {
            log.error("Error while fetching users who liked post : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/saves/{postId}")
    public ResponseEntity<Void> savePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID postId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            saveService.savePost(user.getId(), postId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while liking post : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/saves/{postId}")
    public ResponseEntity<Void> unsavePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID postId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            saveService.unsavePost(user.getId(), postId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while removing saved post : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/saves/{postId}")
    public ResponseEntity<Boolean> hasUserSavedPost(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable UUID postId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(saveService.hasUserSavedPost(user.getId(), postId));
        } catch (Exception e) {
            log.error("Error while fetching saved posts : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/saved-posts")
    public ResponseEntity<Page<PostResponseDto>> getSavedPostsByUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            Page<PostResponseDto> savedPosts = saveService.getSavedPostsByUser(user.getId(), page, size);
            return ResponseEntity.ok(savedPosts);
        } catch (Exception e) {
            log.error("Error while fetching saved posts by user : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<PostResponseDto>> getPostsByTag(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,  // Default page is 0
            @RequestParam(defaultValue = "10") int size  // Default size is 10
    ) {
        try {
            usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            Page<PostResponseDto> posts = postService.getPostsByTag(tag, page, size); // Paginated posts
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            log.error("Error while getting post by tag : {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }


}
