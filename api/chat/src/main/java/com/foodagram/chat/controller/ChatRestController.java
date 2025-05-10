package com.foodagram.chat.controller;

import com.foodagram.chat.service.ChatService;
import com.foodagram.chat.util.UsersUtil;
import com.foodagram.clients.auth.AuthClient;
import com.foodagram.clients.chat.dto.ChatMessageDto;
import com.foodagram.clients.chat.dto.ConversationDto;
import com.foodagram.clients.content.enums.ReportReason;
import com.foodagram.clients.users.dto.UsersDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatRestController {
    private final ChatService chatService;
    private final UsersUtil usersUtil;
    private final AuthClient authClient;

    @GetMapping("/conversations")
    public List<ConversationDto> myConversations(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwt) {
        UsersDto me = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwt);
        return chatService.listConversations(me.getId());
    }

    @GetMapping("/{conversationId}/messages")
    public List<ChatMessageDto> history(@PathVariable UUID conversationId,
                                        @RequestHeader(HttpHeaders.AUTHORIZATION) String jwt) {
        UsersDto me = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwt);
        return chatService.getLast50(conversationId, me.getId());
    }

    @DeleteMapping("/messages/{messageId}")
    public void deleteMessage(
            @PathVariable UUID messageId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwt
    ) {
        UsersDto me = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwt);
        chatService.deleteMessage(messageId, me.getId());
    }

    @PostMapping("/{id}/report")
    public void report(@PathVariable UUID id,
                       @RequestBody ReportRequest request,
                       @RequestHeader(HttpHeaders.AUTHORIZATION) String jwt) {

        UsersDto me = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwt);
        chatService.reportMessage(id, me, request.reason(), request.notes());
    }

    public record ReportRequest(ReportReason reason, String notes) {}
}
