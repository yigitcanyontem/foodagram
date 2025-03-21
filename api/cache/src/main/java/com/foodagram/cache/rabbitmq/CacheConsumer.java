package com.foodagram.cache.rabbitmq;

import com.foodagram.clients.users.dto.UsersDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import com.foodagram.cache.service.CacheService;

@Component
@RequiredArgsConstructor
@Slf4j
public class CacheConsumer {

    private final CacheService cacheService;

    @RabbitListener(queues = "${rabbitmq.queues.user-cache}")
    public void saveOrUpdateUserConsumer(UsersDto usersDto) {
        log.info("Consuming message: {}", usersDto);
        cacheService.saveOrUpdateUser(usersDto);
    }
}
