package com.foodagram.content.service;

import com.foodagram.clients.content.dto.PostResponseDto;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.content.domain.Post;
import com.foodagram.content.domain.Save;
import com.foodagram.content.repository.PostRepository;
import com.foodagram.content.repository.SaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SaveService {
    private final SaveRepository saveRepository;
    private final PostRepository postRepository;
    private final UsersClient usersClient;
    private final PostService postService;

    @Transactional
    public void savePost(UUID userId, UUID postId) {
        // Avoid duplicate saves
        if (saveRepository.findByUserIdAndPostId(userId, postId).isPresent()) {
            return;
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Save save = Save.builder()
                .userId(userId)
                .post(post)
                .build();

        saveRepository.save(save);
        post.setSaves(post.getSaves() + 1);
        postRepository.save(post);
    }

    @Transactional
    public void unsavePost(UUID userId, UUID postId) {
        saveRepository.findByUserIdAndPostId(userId, postId).ifPresent(save -> {
            saveRepository.delete(save);
            Post post = save.getPost();
            post.setSaves(Math.max(0, post.getSaves() - 1));
            postRepository.save(post);
        });
    }

    public boolean hasUserSavedPost(UUID userId, UUID postId) {
        return saveRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    public long countSaves(UUID postId) {
        return saveRepository.countByPostId(postId);
    }

    public List<UsersProfileDto> getUsersWhoSavedPost(UUID postId) {
        List<UUID> userIds = saveRepository.findByPostId(postId)
                .stream()
                .map(Save::getUserId)
                .toList();

        List<UsersProfileDto> usersDtos = usersClient.getUsersByIds(userIds).getBody();
        return usersDtos;
    }

    public List<PostResponseDto> getSavedPostsByUser(UUID userId) {
        List<UUID> postIds = saveRepository.findByUserId(userId)
                .stream()
                .map(
                        save -> save.getPost().getId()
                )
                .toList();

        return postService.getAllPostsByIDIn(postIds);
    }

}
