package com.foodagram.user.service;

import com.foodagram.clients.notification.dto.NotificationType;
import com.foodagram.user.rabbitmq.AMQPService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
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
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UsersEngagementService {
    private final RabbitMQMessageProducer rabbitMQMessageProducer;
    private final UsersEngagementRepository usersEngagementRepository;
    private final UsersProfileService usersProfileService;
    private final AMQPService aMQPService;

    public List<UsersProfileDto> getUserFollowers(UUID userId) {
        List<UsersEngagement> usersEngagements = usersEngagementRepository.getUsersEngagementsByEngagedUserIdAndUserEngagementType(userId, UserEngagementType.FOLLOW);
        return usersEngagements.stream()
                .parallel()
                .map(usersEngagement -> usersProfileService.getUsersProfileByUsersId(usersEngagement.getUserId()))
                .toList();
    }

    public List<UsersProfileDto> getUserFollowing(UUID userId) {
        List<UsersEngagement> usersEngagements = usersEngagementRepository.getUsersEngagementsByUserIdAndUserEngagementType(userId, UserEngagementType.FOLLOW);
        return usersEngagements.stream()
                .parallel()
                .map(usersEngagement -> usersProfileService.getUsersProfileByUsersId(usersEngagement.getEngagedUserId()))
                .toList();
    }

    @Transactional
    public void followUser(UUID userId, UUID engagedUserId) {
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

        try {
            aMQPService.publishToNotificationQueue(
                    new GenericRabbitMQMessage(
                            "createNotification",
                            new NotificationCreateDto(
                                    engagedUserId,
                                    "New Follower",
                                    usersProfileService.getUsersProfileByUsersId(userId).getUsername() + " started following you.",
                                    NotificationType.LIKE,
                                    "Profile/" + userId,
                                    userId
                            )
                    )
            );
        } catch (Exception e) {
            log.error("Error while publishing to notification queue: {}", e.getMessage());
        }
    }

    @Transactional
    public void unfollowUser(UUID userId, UUID engagedUserId) {
        usersEngagementRepository.deleteUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(userId, engagedUserId, UserEngagementType.FOLLOW);
        rabbitMQMessageProducer.publish(
                new GenericRabbitMQMessage("api/v1/user-profile/update-following", new UserFollowDto(userId, engagedUserId, false)),
                "internal.exchange",
                "internal.user.routing-key"
        );
    }

    public boolean isUserFollowing(UUID userId, UUID engagedUserId) {
        return usersEngagementRepository.existsUsersEngagementByUserIdAndEngagedUserIdAndUserEngagementType(userId, engagedUserId, UserEngagementType.FOLLOW);
    }

}
