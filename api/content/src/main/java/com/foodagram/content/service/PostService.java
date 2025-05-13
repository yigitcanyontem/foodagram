package com.foodagram.content.service;

import com.foodagram.clients.content.dto.*;
import com.foodagram.clients.content.enums.Visibility;
import com.foodagram.clients.files.FilesClient;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.enums.Role;
import com.foodagram.content.domain.Ingredient;
import com.foodagram.content.domain.Post;
import com.foodagram.content.domain.Recipe;
import com.foodagram.content.repository.PostRepository;
import com.foodagram.content.repository.SaveRepository;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    private final LikeService likeService;
    private final SaveRepository saveRepository;

    private final FilesClient filesClient;

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

    public List<PostResponseDto> getAllPostsByUser(UUID userId, UsersDto user) {
        // Check if the requesting user is the owner
        boolean isOwner = user.getId().equals(userId);
        
        // If not owner, check if they are a follower
        boolean isFollower = false;
        if (!isOwner) {
            var followingResponse = usersClient.getUserFollowing(user.getId());
            if (followingResponse.getBody() != null) {
                isFollower = followingResponse.getBody().stream()
                    .anyMatch(following -> following.getUsersId().equals(userId));
            }
        }

        // Get posts based on visibility rules
        List<Post> posts = postRepository.findAllByUserIdWithVisibilityRules(userId, isOwner, isFollower);
        
        return posts.stream()
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
        throwIfUserIsNotOwnerOfPostOrAdmin(usersDto.getId(), post.getUserId());

        post.setTitle(postUpdateDto.getTitle());
        post.setContent(postUpdateDto.getContent());
        post.setMediaUrls(postUpdateDto.getMediaUrls());
        post.setTags(postUpdateDto.getTags());
        post.setVisibility(postUpdateDto.getVisibility());
        post.setLocation(postUpdateDto.getLocation());
        return mapToResponseDto(postRepository.save(post));
    }

    @Transactional
    public void deletePost(UUID id, UsersDto usersDto) {
        Post post = findPostById(id);
        throwIfUserIsNotOwnerOfPostOrAdmin(usersDto.getId(), post.getUserId());
        likeService.deleteLikesByPostId(id);
        commentService.deleteCommentsByPostId(id);
        saveRepository.deleteAllByPost_Id(id);
        post.getMediaUrls().forEach(url -> {
            try {
                String key = url.substring(url.indexOf('/') + 1);
                filesClient.deleteFileByFileName(key);
            } catch (Exception ex) {
                log.warn("Could not delete media {} – {}", url, ex.getMessage());
            }
        });

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


    private void throwIfUserIsNotOwnerOfPostOrAdmin(UUID userId, UUID creatorId) {
        UsersDto user = usersClient.getUserById(userId).getBody();

        if (user == null) {
            throw new ForbiddenException("User not found");
        }

        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        boolean isOwner = userId.equals(creatorId);

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException("You are neither the owner of this post nor an admin");
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

    public Page<PostResponseDto> getPostsByTag(String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdDate")));
        Page<Post> postPage = postRepository.findPostsByTagsContainingAndVisibilityNotOrderByCreatedDateDesc(tag, Visibility.PRIVATE, pageable);

        return postPage.map(this::mapToResponseDto); // Mapping to PostResponseDto while retaining pagination
    }

    public Page<PostResponseDto> getRandomPublicPostsForExplore(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Post> postPage = postRepository.findAllByUserIdNotAndVisibilityNotOrderByCreatedDateDesc(userId,Visibility.PRIVATE, pageable);
        return postPage.map(this::mapToResponseDto);
    }

    public Page<PostResponseDto> getSavedPostsByUser(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdDate")));
        Page<UUID> savedPostIds = saveRepository.findPostIdsByUserId(userId, pageable);
        Page<Post> postPage = postRepository.findAllByIdIn(savedPostIds.getContent(), pageable);
        return postPage.map(this::mapToResponseDto);
    }

    public List<PostResponseDto> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(post -> {
                    PostResponseDto dto = mapToResponseDto(post);
                    dto.setUsername(Objects.requireNonNull(usersClient.getUserById(post.getUserId()).getBody()).getUsername());
                    return dto;
                }).toList();
    }

}
