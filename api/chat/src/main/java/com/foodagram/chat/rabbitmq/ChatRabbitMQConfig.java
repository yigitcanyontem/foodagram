package com.foodagram.chat.rabbitmq;

import lombok.Getter;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration @Getter
public class ChatRabbitMQConfig {

    @Value("${rabbitmq.exchanges.internal}")
    private String internalExchange;

    @Value("${rabbitmq.queues.command}")
    private String commandQueue;

    @Value("${rabbitmq.queues.event}")
    private String eventQueue;             // <-- optional

    @Value("${rabbitmq.routing-keys.chat-command}")
    private String commandBindingKey;      // chat.command.#

    @Value("${rabbitmq.routing-keys.chat-event}")
    private String eventBindingKey;        // chat.message.created

    /* --- Exchange --------------------------------------------------- */
    @Bean TopicExchange internalExchange() {
        return new TopicExchange(internalExchange);
    }

    /* --- Incoming commands ----------------------------------------- */
    @Bean Queue commandQueue()               { return new Queue(commandQueue); }
    @Bean Binding commandBinding() {
        return BindingBuilder.bind(commandQueue())
                .to(internalExchange())
                .with(commandBindingKey);          // chat.command.#
    }

    /* --- Outgoing events  (optional) ------------------------------- */
    @Bean Queue eventQueue()                 { return new Queue(eventQueue); }
    @Bean Binding eventBinding() {
        return BindingBuilder.bind(eventQueue())
                .to(internalExchange())
                .with(eventBindingKey);            // chat.message.created
    }
}