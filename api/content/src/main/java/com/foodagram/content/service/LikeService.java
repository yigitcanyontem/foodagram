package com.foodagram.content.service;

import com.foodagram.clients.notification.NotificationCreateDto;
import com.foodagram.clients.notification.dto.NotificationType;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.content.domain.Like;
import com.foodagram.content.domain.Post;
import com.foodagram.content.rabbitmq.AMQPService;
import com.foodagram.content.repository.LikeRepository;
import com.foodagram.content.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UsersClient usersClient;
    private final AMQPService aMQPService;

    @Transactional
    public void likePost(UUID userId, UUID postId) {
        // Avoid duplicate likes
        if (likeRepository.findByUserIdAndPostId(userId, postId).isPresent()) {
            return;
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Like like = Like.builder()
                .userId(userId)
                .post(post)
                .build();

        likeRepository.save(like);
        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);

        if (!userId.equals(post.getUserId())){
            try {
                aMQPService.publishToNotificationQueue(
                        new GenericRabbitMQMessage(
                                "createNotification",
                                new NotificationCreateDto(
                                        post.getUserId(),
                                        "New Like",
                                        "",
                                        NotificationType.LIKE,
                                        "PostDetail/" + post.getId(),
                                        userId
                                )
                        )
                );
            } catch (Exception e) {
                log.error("Error while publishing to notification queue: {}", e.getMessage());
            }
        }
    }

    @Transactional
    public void unlikePost(UUID userId, UUID postId) {
        likeRepository.findByUserIdAndPostId(userId, postId).ifPresent(like -> {
            likeRepository.delete(like);
            Post post = like.getPost();
            post.setLikes(Math.max(0, post.getLikes() - 1));
            postRepository.save(post);
        });
    }

    public boolean hasUserLikedPost(UUID userId, UUID postId) {
        return likeRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    public long countLikes(UUID postId) {
        return likeRepository.countByPostId(postId);
    }

    public List<UsersProfileDto> getUsersWhoLikedPost(UUID postId) {
        List<UUID> userIds = likeRepository.findByPostId(postId)
                .stream()
                .map(Like::getUserId)
                .toList();

        List<UsersProfileDto> usersDtos = usersClient.getUsersByIds(userIds).getBody();
        return usersDtos;
    }
}
