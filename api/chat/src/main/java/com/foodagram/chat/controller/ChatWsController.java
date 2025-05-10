package com.foodagram.chat.controller;

import com.foodagram.chat.service.ChatService;
import com.foodagram.clients.chat.dto.ChatMessageDto;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatWsController {

    private final ChatService chatService;
    private final SimpMessagingTemplate broker;

    @MessageMapping("/chat.send")
    public void receive(ChatMessageDto dto,
                        org.springframework.messaging.Message<?> raw) {

        // ⬅ get session attributes exactly like before
        var accessor = SimpMessageHeaderAccessor.wrap(raw);
        UsersDto sender = (UsersDto) accessor.getSessionAttributes().get("user");

        ChatMessageDto saved = chatService.handleIncoming(dto, sender);

        broker.convertAndSend("/topic/room." + saved.getConversationId(), saved);
        broker.convertAndSendToUser(saved.getReceiverId().toString(), "/queue/chat", saved);
        broker.convertAndSendToUser(sender.getId().toString(), "/queue/chat", saved);
    }
}


