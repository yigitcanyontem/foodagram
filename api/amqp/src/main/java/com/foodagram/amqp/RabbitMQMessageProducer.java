package com.foodagram.amqp;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Component;


@Component
@Slf4j
@AllArgsConstructor
public class RabbitMQMessageProducer {
    private final AmqpTemplate amqpTemplate;

    public void publish(Object payload, String exchange, String routingKey) {
        try {
            log.info("Publishing message to exchange: {} with routing key: {}. payload: {}", exchange, routingKey, payload);
            amqpTemplate.convertAndSend(exchange, routingKey, payload);
            log.info("Published message to exchange: {} with routing key: {}. payload: {}", exchange, routingKey, payload);
        }catch (Exception e) {
            log.error("Error occurred while publishing message to exchange: {} with routing key: {}. payload: {}", exchange, routingKey, payload, e);
        }
    }
}
