package com.foodagram.content.repository;

import com.foodagram.content.domain.Post;
import com.foodagram.clients.content.enums.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Repository dedicated to “timeline/feed” queries so PostRepository can stay simple.
 */
public interface FeedRepository extends JpaRepository<Post, UUID> {

    @Query("""
           SELECT p
             FROM Post p
            WHERE p.userId IN :userIds
              AND p.visibility <> :excluded
              AND p.createdDate >= :since
            ORDER BY p.createdDate DESC
           """)
    List<Post> findFeedPosts(@Param("userIds") Collection<UUID> userIds,
                             @Param("excluded") Visibility excluded,
                             @Param("since") LocalDateTime since);
}
