package com.foodagram.clients.chat.dto;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ConversationDto {
    private UUID id;
    private UUID otherUserId;
    private String otherUserName;
    private String otherUserAvatar;
    private String lastMessageSnippet;
    private Instant lastMessageTime;
    private Long unreadCount;
}