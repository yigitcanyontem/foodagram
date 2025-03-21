package com.foodagram.cache.rabbitmq;

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
public class CacheConfig {
    @Value("${rabbitmq.exchanges.internal}")
    private String internalExchange;

    @Value("${rabbitmq.queues.user-cache}")
    private String userCacheQueue;

    @Value("${rabbitmq.routing-keys.internal-cache}")
    private String internalCacheRoutingKeys;

    @Bean
    public TopicExchange internalExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue userCacheQueue() {
        return new Queue(userCacheQueue);
    }

    @Bean
    public Binding userCacheBinder() {
        return BindingBuilder
                .bind(userCacheQueue())
                .to(internalExchange())
                .with(internalCacheRoutingKeys);
    }

}
