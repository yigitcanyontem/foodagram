package com.foodagram.content.repository;

import com.foodagram.clients.content.enums.Visibility;
import com.foodagram.content.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findByUserId(UUID userId);
    List<Post> findByUserIdAndVisibility(UUID userId, String visibility);
    List<Post> findByTagsContaining(String tag);

    List<Post> findAllByUserId(UUID userId);
    List<Post> findAllByUserIdAndVisibilityNotOrderByCreatedDateDesc(UUID userId, Visibility visibility);

    List<Post> findAllByIdIn(List<UUID> ids);

    List<Post> findPostsByTagsContainingAndVisibilityNotOrderByCreatedDateDesc(String tags, Visibility visibility);

    List<Post> findAllByUserIdNotAndVisibilityNotOrderByCreatedDateDesc(UUID id, Visibility visibility);

    @Query("SELECT p FROM Post p WHERE p.visibility = :visibility AND p.userId != :userId ORDER BY RAND()")
    Page<Post> findRandomPublicPostsForExplore(UUID userId, Pageable pageable);
}
