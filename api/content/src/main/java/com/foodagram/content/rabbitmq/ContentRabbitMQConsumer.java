package com.foodagram.content.rabbitmq;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ContentRabbitMQConsumer {

    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "${rabbitmq.queues.content}")
    public void consumeContentQueue(GenericRabbitMQMessage genericRabbitMQMessage) {
        try {
            log.info("Consuming message: {}", genericRabbitMQMessage);
        }catch (Exception e) {
            log.error("Error while consuming message: {}", e.getMessage());
        }
    }
}
