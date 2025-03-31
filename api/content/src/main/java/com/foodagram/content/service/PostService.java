package com.foodagram.content.service;

import com.foodagram.content.model.Post;
import com.foodagram.content.model.Recipe;
import com.foodagram.content.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Post createPost(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public Recipe createRecipe(Recipe recipe) {
        recipe.setType(Post.PostType.RECIPE);
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());
        return (Recipe) postRepository.save(recipe);
    }

    public Post getPost(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public List<Post> getUserPosts(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post updatePost(String id, Post post) {
        Post existingPost = getPost(id);
        post.setId(id);
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    public Post likePost(String id) {
        Post post = getPost(id);
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    public Post unlikePost(String id) {
        Post post = getPost(id);
        post.setLikes(Math.max(0, post.getLikes() - 1));
        return postRepository.save(post);
    }
} 