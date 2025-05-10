package com.foodagram.clients.chat;

import com.foodagram.clients.chat.dto.ChatMessageDto;
import com.foodagram.clients.chat.dto.ConversationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "chat")
public interface ChatClient {
    @GetMapping(path = "api/v1/chat/{conversationId}/messages")
    List<ChatMessageDto> getMessages(@PathVariable UUID conversationId);

    @GetMapping(path = "api/v1/chat/conversations")
    List<ConversationDto> getMyConversations(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt);
}