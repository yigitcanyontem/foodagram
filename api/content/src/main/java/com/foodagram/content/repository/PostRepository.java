package com.foodagram.content.repository;

import com.foodagram.content.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
    List<Post> findByUserIdAndVisibility(String userId, Post.Visibility visibility);
    List<Post> findByTagsContaining(String tag);
} 