package com.foodagram.content.service;

import com.foodagram.clients.content.dto.PostResponseDto;
import com.foodagram.clients.content.enums.Visibility;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.content.domain.Post;
import com.foodagram.content.repository.FeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Builds the home-page feed for a user.  Relies only on {@link UsersClient} for both
 * profile lookup <em>and</em> the list of accounts the caller follows, so there's no extra
 * Feign client bean.
 */
@Service
@RequiredArgsConstructor
public class FeedService {

    private static final int DEFAULT_WINDOW_HOURS = 24;

    private final FeedRepository feedRepository;
    private final UsersClient usersClient;

    /**
     * Returns a list of posts by authors the user follows (last 24 h).
     */
    @Transactional(readOnly = true)

    public List<PostResponseDto> getFeed(UUID userId, int page, int limit) {
        Objects.requireNonNull(userId, "userId cannot be null");

        /* 1️⃣  Ask user‑service whom this account follows. */
        ResponseEntity<List<UsersProfileDto>> resp = usersClient.getUserFollowing(userId);
        List<UsersProfileDto> following = Optional.ofNullable(resp.getBody()).orElseGet(List::of);
        if (following.isEmpty()) {
            return List.of();
        }
        Set<UUID> followedIds = following.stream()
                .map(UsersProfileDto::getUsersId)
                .collect(Collectors.toSet());

        /* 2️⃣  Fetch their recent public posts */
        LocalDateTime since = LocalDateTime.now().minusHours(DEFAULT_WINDOW_HOURS);

        // Create Pageable object using PageRequest
        Pageable pageable = PageRequest.of(page - 1, limit);  // Spring uses 0-based index

        Page<Post> posts = feedRepository.findFeedPosts(followedIds, Visibility.PRIVATE, since, pageable);

        if (posts.isEmpty()) {
            return List.of();
        }

        /* 3️⃣  Map to DTOs adding username */
        Map<UUID, String> usernameCache = new HashMap<>();
        return posts.stream()
                .map(p -> mapToDto(p, usernameCache))
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────── helpers ───

    private PostResponseDto mapToDto(Post post, Map<UUID, String> cache) {
        PostResponseDto dto = PostResponseDto.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .title(post.getTitle())
                .content(post.getContent())
                .mediaUrls(post.getMediaUrls())
                .tags(post.getTags())
                .visibility(post.getVisibility())
                .location(post.getLocation())
                .processTime(post.getProcessTime())
                .likes(post.getLikes())
                .comments(post.getComments())
                .createdAt(post.getCreatedDate())
                .updatedAt(post.getUpdatedDate())
                .recipe(null)
                .build();

        dto.setUsername(resolveUsername(post.getUserId(), cache));
        return dto;
    }

    private String resolveUsername(UUID userId, Map<UUID, String> cache) {
        return cache.computeIfAbsent(userId, id -> {
            var resp = usersClient.getUserById(id);
            return Objects.requireNonNull(resp.getBody()).getUsername();
        });
    }
}
