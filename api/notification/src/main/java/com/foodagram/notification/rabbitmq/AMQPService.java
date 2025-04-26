package com.foodagram.notification.rabbitmq;

import com.foodagram.amqp.RabbitMQMessageProducer;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AMQPService {
    private final RabbitMQMessageProducer rabbitMQMessageProducer;

    @Value("${rabbitmq.exchanges.internal}")
    private String internalExchange;

    @Value("${rabbitmq.routing-keys.internal-notification}")
    private String internalNotificationRoutingKeys;

    public void publishToNotificationQueue(GenericRabbitMQMessage payload) {
        try {
            rabbitMQMessageProducer
                    .publish(payload,
                            internalExchange,
                            internalNotificationRoutingKeys);
            log.info("Published to notification queue");
        } catch (Exception e) {
            log.error("Error while publishing to notification queue: {}", e.getMessage());
        }
    }
}
