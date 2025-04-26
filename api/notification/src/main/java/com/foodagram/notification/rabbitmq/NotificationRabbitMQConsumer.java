package com.foodagram.notification.rabbitmq;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodagram.clients.notification.NotificationCreateDto;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.users.dto.UserFollowDto;
import com.foodagram.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationRabbitMQConsumer {
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    @RabbitListener(queues = "${rabbitmq.queues.notification}")
    public void consumeNotificationQueue(GenericRabbitMQMessage genericRabbitMQMessage) {
        try {
            log.info("Consuming message: {}", genericRabbitMQMessage);
            if (genericRabbitMQMessage.getEndpoint().equals("createNotification")) {
                NotificationCreateDto notificationCreateDto = objectMapper.convertValue(genericRabbitMQMessage.getMessage(), NotificationCreateDto.class);
                notificationService.createNotification(notificationCreateDto);
            }else if (genericRabbitMQMessage.getEndpoint().equals("setNotificationAsRead")) {
                notificationService.setNotificationAsRead((List<UUID>) genericRabbitMQMessage.getMessage());
            }
        }catch (Exception e) {
            log.error("Error while consuming message: {}", e.getMessage());
        }
    }
}
