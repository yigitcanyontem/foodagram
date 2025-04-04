package com.foodagram.content.mapper;

import com.foodagram.content.domain.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PostMapper {
    private final RecipeMapper recipeMapper;

//    public PostDTO toDTO(Post post) {
//        if (post == null) return null;
//
//        RecipeDTO recipeDTO = null;
//        if (post.getRecipe() != null) {
//            recipeDTO = recipeMapper.toDTO(post.getRecipe());
//        }
//
//        return PostDTO.builder()
//                .id(post.getId())
//                .userId(post.getUserId())
//                .content(post.getContent())
//                .mediaUrls(post.getMediaUrls())
//                .tags(post.getTags())
//                .visibility(post.getVisibility())
//                .recipe(recipeDTO)
//                .likes(post.getLikes())
//                .comments(post.getComments())
//                .createdAt(post.getCreatedDate())
//                .updatedAt(post.getUpdatedDate())
//                .build();
//    }
//
//    public Post toDomain(PostDTO dto) {
//        if (dto == null) return null;
//
//        return Post.builder()
//                .id(dto.getId())
//                .userId(dto.getUserId())
//                .content(dto.getContent())
//                .mediaUrls(dto.getMediaUrls())
//                .tags(dto.getTags())
//                .visibility(dto.getVisibility())
//                .recipe(dto.getRecipe() != null ? recipeMapper.toDomain(dto.getRecipe()) : null)
//                .likes(dto.getLikes())
//                .comments(dto.getComments())
//                .build();
//    }
//
//    public List<PostDTO> toDTOList(List<Post> posts) {
//        if (posts == null) return null;
//        return posts.stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
} 
