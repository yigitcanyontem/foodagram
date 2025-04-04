package com.foodagram.content.rabbitmq;

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
public class ContentRabbitMQConfig {
    @Value("${rabbitmq.exchanges.internal}")
    private String internalExchange;

    @Value("${rabbitmq.queues.content}")
    private String contentQueue;

    @Value("${rabbitmq.routing-keys.internal-content}")
    private String internalContentRoutingKeys;

    @Bean
    public TopicExchange internalExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue contentQueue() {
        return new Queue(contentQueue);
    }

    @Bean
    public Binding contentBinder() {
        return BindingBuilder
                .bind(contentQueue())
                .to(internalExchange())
                .with(internalContentRoutingKeys);
    }

}
