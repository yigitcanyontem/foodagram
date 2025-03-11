package com.foodagram.user.rabbitmq;

import lombok.Getter;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class UsersRabbitMQConfig {
    @Value("${rabbitmq.exchanges.internal}")
    private String internalExchange;

    @Value("${rabbitmq.queues.user}")
    private String userQueue;

    @Value("${rabbitmq.routing-keys.internal-user}")
    private String internalUserRoutingKeys;

    @Bean
    public TopicExchange internalExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue userQueue() {
        return new Queue(userQueue);
    }

    @Bean
    public Binding userBinder() {
        return BindingBuilder
                .bind(userQueue())
                .to(internalExchange())
                .with(internalUserRoutingKeys);
    }

}
