package com.foodagram.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.foodagram.clients.users.enums.UserEngagementType;
import com.foodagram.user.domain.UsersEngagement;
import java.util.List;

@Repository
public interface UsersEngagementRepository extends JpaRepository<UsersEngagement, Integer> {
    long countUsersEngagementsByUserIdAndUserEngagementType(Integer userId, UserEngagementType userEngagementType);
    long countUsersEngagementsByEngagedUserIdAndUserEngagementType(Integer engagedUserId, UserEngagementType userEngagementType);

    List<UsersEngagement> getUsersEngagementsByUserIdAndUserEngagementType(Integer userId, UserEngagementType userEngagementType);
    List<UsersEngagement> getUsersEngagementsByEngagedUserIdAndUserEngagementType(Integer engagedUserId, UserEngagementType userEngagementType);

    boolean existsUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(Integer userId, Integer engagedUserId, UserEngagementType userEngagementType);

    void deleteUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(Integer userId, Integer engagedUserId, UserEngagementType userEngagementType);
}
