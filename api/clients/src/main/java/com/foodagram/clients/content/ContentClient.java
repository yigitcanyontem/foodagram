package com.foodagram.clients.content;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "content")
public interface ContentClient {
}
