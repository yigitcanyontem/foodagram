package com.foodagram.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.foodagram.amqp.RabbitMQMessageProducer;
import com.foodagram.clients.notification.NotificationCreateDto;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.users.dto.UserFollowDto;
import com.foodagram.clients.users.enums.UserEngagementType;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.user.domain.UsersEngagement;
import com.foodagram.user.repository.UsersEngagementRepository;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UsersEngagementService {
    private final RabbitMQMessageProducer rabbitMQMessageProducer;
    private final UsersEngagementRepository usersEngagementRepository;

    public long getUserFollowerCount(Integer userId) {
        return usersEngagementRepository.countUsersEngagementsByEngagedUserIdAndUserEngagementType(userId, UserEngagementType.FOLLOW);
    }

    public long getUserFollowingCount(Integer userId) {
        return usersEngagementRepository.countUsersEngagementsByUserIdAndUserEngagementType(userId, UserEngagementType.FOLLOW);
    }

    public List<UsersProfileDto> getUserFollowers(Integer userId) {
        List<UsersEngagement> usersEngagements = usersEngagementRepository.getUsersEngagementsByEngagedUserIdAndUserEngagementType(userId, UserEngagementType.FOLLOW);
        //TODO: Implement this method
        return null;
    }

    public List<UsersProfileDto> getUserFollowing(Integer userId) {
        List<UsersEngagement> usersEngagements = usersEngagementRepository.getUsersEngagementsByUserIdAndUserEngagementType(userId, UserEngagementType.FOLLOW);
        //TODO: Implement this method
        return null;
    }

    public void followUser(Integer userId, Integer engagedUserId) {
        UsersEngagement usersEngagement = UsersEngagement.builder()
                .userId(userId)
                .engagedUserId(engagedUserId)
                .userEngagementType(UserEngagementType.FOLLOW)
                .build();
        usersEngagementRepository.save(usersEngagement);
        rabbitMQMessageProducer.publish(
                new GenericRabbitMQMessage("api/v1/user-profile/update-following", new UserFollowDto(userId, engagedUserId, true)),
                "internal.exchange",
                "internal.user.routing-key"
        );
    }

    public void unfollowUser(Integer userId, Integer engagedUserId) {
        usersEngagementRepository.deleteUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(userId, engagedUserId, UserEngagementType.FOLLOW);
        rabbitMQMessageProducer.publish(
                new GenericRabbitMQMessage("api/v1/user-profile/update-following", new UserFollowDto(userId, engagedUserId, false)),
                "internal.exchange",
                "internal.user.routing-key"
        );
    }

    public boolean isUserFollowing(Integer userId, Integer engagedUserId) {
        return usersEngagementRepository.existsUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(userId, engagedUserId, UserEngagementType.FOLLOW);
    }

    public boolean isUserFollowed(Integer userId, Integer engagedUserId) {
        return usersEngagementRepository.existsUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(engagedUserId, userId, UserEngagementType.FOLLOW);
    }

}
