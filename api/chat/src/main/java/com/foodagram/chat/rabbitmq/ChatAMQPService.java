package com.foodagram.chat.rabbitmq;

import com.foodagram.amqp.RabbitMQMessageProducer;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j @Service @RequiredArgsConstructor
public class ChatAMQPService {

    private final RabbitMQMessageProducer rabbit;   // you already have this lib

    @Value("${rabbitmq.exchanges.internal}")
    private String exchange;

    @Value("${rabbitmq.routing-keys.chat-event}")
    private String chatEventRK;          // chat.message.created

    public void publishMessageCreated(GenericRabbitMQMessage payload) {
        try {
            rabbit.publish(payload, exchange, chatEventRK);
            log.info("→ published chat.message.created");
        } catch (Exception e) {
            log.error("Rabbit publish failed", e);
        }
    }
}