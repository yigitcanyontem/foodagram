package com.foodagram.content.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private PostType type;
    private String content;
    private List<String> mediaUrls;
    private int likes;
    private List<Comment> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> tags;
    private String location;
    private Visibility visibility;

    public enum PostType {
        REGULAR, RECIPE
    }

    public enum Visibility {
        PUBLIC, PRIVATE, FRIENDS
    }
} 