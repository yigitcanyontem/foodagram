package com.foodagram.clients.chat.dto;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatMessageDto {
    /** null when this is the first message and a conversation must be created */
    private UUID id;
    private UUID conversationId;
    private UUID receiverId;

    /* filled‑in by server */
    private UUID senderId;
    private String content;
    private Instant timestamp;

    private Boolean deleted;
}
