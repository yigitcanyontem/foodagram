package com.foodagram.content.service;

import com.foodagram.clients.content.dto.*;
import com.foodagram.clients.content.enums.Visibility;
import com.foodagram.clients.files.FilesClient;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.domain.Ingredient;
import com.foodagram.content.domain.Post;
import com.foodagram.content.domain.Recipe;
import com.foodagram.content.repository.PostRepository;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UsersClient usersClient;
    private final CommentService commentService;

    @Transactional
    public PostResponseDto createPost(PostCreateDto postCreateDto) {
        if (postCreateDto.getUserId() == null || postCreateDto.getUserId().equals("") ||
                postCreateDto.getMediaUrls() == null || postCreateDto.getMediaUrls().isEmpty()
        ) {
            throw new BadRequestException("You must provide a valid media url");
        }

        Post post = Post.builder()
                .userId(postCreateDto.getUserId())
                .title(postCreateDto.getTitle())
                .content(postCreateDto.getContent())
                .mediaUrls(postCreateDto.getMediaUrls())
                .tags(postCreateDto.getTags())
                .visibility(postCreateDto.getVisibility())
                .location(postCreateDto.getLocation())
                .recipe(mapDtoToRecipe(postCreateDto.getRecipe()))
                .processTime(0)
                .build();

        Recipe recipe = mapDtoToRecipe(postCreateDto.getRecipe());

        if (recipe != null) {
            recipe.setPost(post);

            recipe.getIngredients().forEach(ingredient -> ingredient.setRecipe(recipe));

            post.setRecipe(recipe);
        }
        return mapToResponseDto(postRepository.save(post));
    }

    public PostResponseDto getPost(UUID id, UsersDto user) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        throwIfPostIsHidden(post.getVisibility(), user.getId(), post.getUserId());
        PostResponseDto responseDto = mapToResponseDto(post);
        responseDto.setUsername(Objects.requireNonNull(usersClient.getUserById(post.getUserId()).getBody()).getUsername());
        return responseDto;
    }

    public List<PostResponseDto> getAllPostsByUser(UUID userId) {
        return postRepository.findAllByUserIdAndVisibilityNotOrderByCreatedDateDesc(userId, Visibility.PRIVATE).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    public List<PostResponseDto> getAllPostsByIDIn(List<UUID> postIds) {
        return postRepository.findAllByIdIn(postIds).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponseDto updatePost(UUID id, PostUpdateDto postUpdateDto, UsersDto usersDto) {
        Post post = findPostById(id);
        throwIfUserIsNotOwnerOfPost(usersDto.getId(), post.getUserId());

        post.setTitle(postUpdateDto.getTitle());
        post.setContent(postUpdateDto.getContent());
        post.setMediaUrls(postUpdateDto.getMediaUrls());
        post.setTags(postUpdateDto.getTags());
        post.setVisibility(postUpdateDto.getVisibility());
        post.setLocation(postUpdateDto.getLocation());
        post.setLikes(postUpdateDto.getLikes());
        post.setComments(postUpdateDto.getComments());
        post.setSaves(postUpdateDto.getSaves());
        return mapToResponseDto(postRepository.save(post));
    }

    @Transactional
    public void deletePost(UUID id, UsersDto usersDto) {
        Post post = findPostById(id);
        throwIfUserIsNotOwnerOfPost(usersDto.getId(), post.getUserId());
        postRepository.deleteById(id);
    }

    private Post findPostById(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    private PostResponseDto mapToResponseDto(Post post) {
        return PostResponseDto.builder()
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
                .saves(post.getSaves())
                .comments(post.getComments())
                .createdAt(post.getCreatedDate())
                .updatedAt(post.getUpdatedDate())
                .recipe(mapRecipeToResponseDto(post.getRecipe()))
                .build();
    }

    private Recipe mapDtoToRecipe(RecipeCreateDto recipeCreateDto) {
        if (recipeCreateDto == null) {
            return null;
        }

        Recipe recipe = Recipe.builder()
                .title(recipeCreateDto.getTitle())
                .description(recipeCreateDto.getDescription())
                .ingredients(recipeCreateDto.getIngredients().stream()
                        .map(ingredientDto -> Ingredient.builder()
                                .name(ingredientDto.getName())
                                .amount(ingredientDto.getAmount())
                                .unit(ingredientDto.getUnit())
                                .build())
                        .collect(Collectors.toList()))
                .instructions(recipeCreateDto.getInstructions())
                .cuisineType(recipeCreateDto.getCuisineType())
                .difficultyLevel(recipeCreateDto.getDifficultyLevel())
                .prepTime(recipeCreateDto.getPrepTime())
                .build();
        return recipe;
    }

    private RecipeResponseDto mapRecipeToResponseDto(Recipe recipe) {
        if (recipe == null) {
            return null;
        }

        return RecipeResponseDto.builder()
                .id(recipe.getId())
                .postId(recipe.getPost().getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .ingredients(recipe.getIngredients().stream()
                        .map(ingredient -> IngredientResponseDto.builder()
                                .id(ingredient.getId())
                                .recipeId(recipe.getId())
                                .name(ingredient.getName())
                                .amount(ingredient.getAmount())
                                .unit(ingredient.getUnit())
                                .createdAt(ingredient.getCreatedDate())
                                .updatedAt(ingredient.getUpdatedDate())
                                .build())
                        .collect(Collectors.toList()))
                .instructions(recipe.getInstructions())
                .cuisineType(recipe.getCuisineType())
                .difficultyLevel(recipe.getDifficultyLevel())
                .createdAt(recipe.getCreatedDate())
                .updatedAt(recipe.getUpdatedDate())
                .prepTime(recipe.getPrepTime())
                .build();
    }


    private void throwIfUserIsNotOwnerOfPost(UUID userId, UUID creatorId) {
        if (!userId.equals(creatorId)) {
            throw new ForbiddenException("You are not owner of this post");
        }
    }


    private void throwIfPostIsHidden(Visibility visibility, UUID id, UUID userId) {
        if (visibility.equals(Visibility.PRIVATE) && !id.equals(userId)) {
            throw new ForbiddenException("You are not owner of this post");
        }
    }

    public void updatePostComments(String message) {
        long commentCount = commentService.getCommentCountByPost(UUID.fromString(message));
        Post post = postRepository.findById(UUID.fromString(message)).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setComments(commentCount);
        postRepository.save(post);
        log.info("Updated post comments: {}", post);
    }
}
