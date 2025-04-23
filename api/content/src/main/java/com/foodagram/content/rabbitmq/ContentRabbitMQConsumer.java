package com.foodagram.content.rabbitmq;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.content.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class ContentRabbitMQConsumer {
    private final ObjectMapper objectMapper;
    private final PostService postService;

    @RabbitListener(queues = "${rabbitmq.queues.content}")
    public void consumeContentQueue(GenericRabbitMQMessage genericRabbitMQMessage) {
        try {
            log.info("Consuming message: {}", genericRabbitMQMessage);
            if (genericRabbitMQMessage.getEndpoint().equals("updatePostComments")){
                postService.updatePostComments((String) genericRabbitMQMessage.getMessage());
            }
        }catch (Exception e) {
            log.error("Error while consuming message: {}", e.getMessage());
        }
    }
}
