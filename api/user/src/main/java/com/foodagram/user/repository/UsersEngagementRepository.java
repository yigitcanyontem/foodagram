package com.foodagram.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.foodagram.clients.users.enums.UserEngagementType;
import com.foodagram.user.domain.UsersEngagement;
import java.util.List;
import java.util.UUID;

@Repository
public interface UsersEngagementRepository extends JpaRepository<UsersEngagement, UUID> {
    long countUsersEngagementsByUserIdAndUserEngagementType(UUID userId, UserEngagementType userEngagementType);
    long countUsersEngagementsByEngagedUserIdAndUserEngagementType(UUID engagedUserId, UserEngagementType userEngagementType);

    List<UsersEngagement> getUsersEngagementsByUserIdAndUserEngagementType(UUID userId, UserEngagementType userEngagementType);
    List<UsersEngagement> getUsersEngagementsByEngagedUserIdAndUserEngagementType(UUID engagedUserId, UserEngagementType userEngagementType);

    boolean existsUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(UUID userId, UUID engagedUserId, UserEngagementType userEngagementType);

    void deleteUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(UUID userId, UUID engagedUserId, UserEngagementType userEngagementType);
}
