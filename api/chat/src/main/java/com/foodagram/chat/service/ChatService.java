package com.foodagram.chat.service;

import com.foodagram.chat.domain.Conversation;
import com.foodagram.chat.domain.Message;
import com.foodagram.chat.rabbitmq.ChatAMQPService;
import com.foodagram.chat.repository.ConversationRepository;
import com.foodagram.chat.repository.MessageRepository;
import com.foodagram.clients.chat.dto.ChatMessageDto;
import com.foodagram.clients.chat.dto.ConversationDto;
import com.foodagram.clients.content.dto.ReportCreationDto;
import com.foodagram.clients.content.enums.ReportReason;
import com.foodagram.clients.content.enums.ReportType;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ConversationRepository convRepo;
    private final MessageRepository      msgRepo;
    private final SimpMessagingTemplate  broker;
    private final UsersClient            usersClient;

    private final ChatAMQPService chatAmqpService;

    /* ------------------------------------------------------------------ */
    /*  Conversation helper – guarantees BOTH participants are present    */
    /* ------------------------------------------------------------------ */
    private Conversation upsertConversation(UUID senderId, UUID receiverId) {
        return convRepo
                .findByParticipantAAndParticipantBOrParticipantBAndParticipantA(senderId, receiverId, senderId, receiverId)
                .orElseGet(() -> convRepo.save(
                        Conversation.builder()
                                .participantA(senderId)
                                .participantB(receiverId)
                                .build()));
    }

    /* ------------------------------------------------------------------ */
    /*  Main entry – called from ChatWsController                         */
    /* ------------------------------------------------------------------ */
    public ChatMessageDto handleIncoming(ChatMessageDto payload, UsersDto sender) {
        UUID senderId = sender.getId();
        UUID receiverId = payload.getReceiverId();

        if (receiverId == null && payload.getConversationId() == null) {
            throw new IllegalArgumentException("ReceiverId must be provided if conversationId is null");
        }

        Conversation conv = (payload.getConversationId() != null)
                ? convRepo.findById(payload.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"))
                : upsertConversation(senderId, receiverId);

        UUID actualReceiverId = senderId.equals(conv.getParticipantA())
                ? conv.getParticipantB() : conv.getParticipantA();

        Message saved = msgRepo.save(Message.builder()
                .conversation(conv)
                .senderId(senderId)
                .content(payload.getContent())
                .build());

        chatAmqpService.publishMessageCreated(
                new GenericRabbitMQMessage(
                        "chatMessageCreated",
                        ChatMessageDto.builder()
                                .id(conv.getId())
                                .conversationId(conv.getId())
                                .senderId(senderId)
                                .receiverId(actualReceiverId)
                                .content(saved.getContent())
                                .timestamp(saved.getCreatedDate()
                                        .toInstant(ZoneOffset.UTC))
                                .build()
                )
        );

        conv.setUpdatedDate(LocalDateTime.now());
        convRepo.save(conv);

        ChatMessageDto outbound = ChatMessageDto.builder()
                .id(saved.getId())
                .conversationId(conv.getId())
                .senderId(senderId)
                .receiverId(actualReceiverId)
                .content(saved.getContent())
                .timestamp(saved.getCreatedDate().toInstant(ZoneOffset.UTC))
                .build();

        broker.convertAndSend("/topic/room." + conv.getId(), outbound);
        broker.convertAndSendToUser(
                actualReceiverId.toString(),
                "/queue/chat",
                outbound);

        return outbound;
    }

    /* ------------------------------------------------------------------ */
    /*                     helpers                                        */
    /* ------------------------------------------------------------------ */

    public List<ConversationDto> listConversations(UUID userId) {

        /* pull following from Users‑service ---------------------------------- */
        List<UsersProfileDto> followingProfiles =
                Optional.ofNullable(usersClient.getUserFollowing(userId).getBody())
                        .orElse(List.of());

        List<UUID> following = followingProfiles.stream()
                .map(UsersProfileDto::getUsersId)
                .filter(otherId -> !otherId.equals(userId))
                .toList();

        for (UUID other : following) {
            upsertConversation(userId, other);
        }
        /* ----------------------------------------------------------------------- */

        return convRepo
                .findByParticipantAOrParticipantBOrderByUpdatedDateDesc(userId, userId)
                .stream()
                .map(c -> toDto(c, userId))
                .toList();
    }

    private ConversationDto toDto(Conversation c, UUID me) {

        UUID other = me.equals(c.getParticipantA()) ? c.getParticipantB()
                : c.getParticipantA();

        /*  profile only  */
        UsersProfileDto otherProfile = usersClient.getUserProfileByUserId(other);

        if (otherProfile == null) {
            // profile not created yet → skip or build a minimal dto
            return ConversationDto.builder()
                    .id(c.getId())
                    .otherUserId(other)
                    .otherUserName("Unknown")
                    .otherUserAvatar("")
                    .lastMessageSnippet("")
                    .lastMessageTime(c.getUpdatedDate().toInstant(ZoneOffset.UTC))
                    .unreadCount(0L)
                    .build();
        }

        Message last = msgRepo.findTop1ByConversationOrderByCreatedDateDesc(c)
                .orElse(null);
        long unread = msgRepo
                .countByConversationAndReadFalseAndSenderIdNot(c, me);

        return ConversationDto.builder()
                .id(c.getId())
                .otherUserId(other)
                .otherUserName(otherProfile.getUsername())        // ←  use username
                .otherUserAvatar(otherProfile.getProfilePicture())
                .lastMessageSnippet(last != null ? last.getContent() : "")
                .lastMessageTime((last != null ? last.getCreatedDate()
                        : c.getUpdatedDate()
                ).toInstant(ZoneOffset.UTC))
                .unreadCount(unread)
                .build();
    }


    public List<ChatMessageDto> getMessagesWithPagination(UUID conversationId, UUID myId, int page, int size) {
        Conversation conv = convRepo.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        UUID otherId = myId.equals(conv.getParticipantA())
                ? conv.getParticipantB()
                : conv.getParticipantA();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        List<Message> msgs = msgRepo.findMessagesByConversationWithPagination(conv, pageable);

        return msgs.stream()
                .map(m -> ChatMessageDto.builder()
                        .id(m.getId())
                        .conversationId(conv.getId())
                        .senderId(m.getSenderId())
                        .receiverId(m.getSenderId().equals(myId) ? otherId : myId)
                        .content(m.getContent())
                        .timestamp(m.getCreatedDate().toInstant(ZoneOffset.UTC))
                        .build())
                .toList();
    }

    /* ---------- DELETE -------------------------------------------------- */
    public void deleteMessage(UUID messageId, UUID userId) {
        Message msg = msgRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        if (!msg.getSenderId().equals(userId)) {
            try {
                throw new AccessDeniedException("Not your message");
            } catch (AccessDeniedException e) {
                throw new RuntimeException(e);
            }
        }
        msg.setDeleted(true);
        msg.setContent("Message deleted");
        msgRepo.save(msg);

        // broadcast the update so everyone’s socket sees it:
        ChatMessageDto update = ChatMessageDto.builder()
                .id(msg.getId())
                .conversationId(msg.getConversation().getId())
                .senderId(msg.getSenderId())
                .receiverId(null)            // recipients infer from conversation
                .content(msg.getContent())
                .timestamp(msg.getCreatedDate().toInstant(ZoneOffset.UTC))
                .deleted(true)
                .build();
        broker.convertAndSend("/topic/room." + msg.getConversation().getId(), update);
        broker.convertAndSendToUser(
                // let the other participant’s personal queue know too
                msg.getConversation().getOtherParticipant(userId).toString(),
                "/queue/chat",
                update
        );
    }

    /* ---------- REPORT -------------------------------------------------- */
    public void reportMessage(UUID msgId, UsersDto reporter,
                              ReportReason reason, String notes) {

        GenericRabbitMQMessage payload = new GenericRabbitMQMessage(
                "createReport",
                new ReportCreationDto(
                        reporter.getId(),
                        reporter.getUsername(),
                        ReportType.CHAT_MESSAGE,
                        msgId,
                        reason,
                        notes
                )
        );
        chatAmqpService.publishToNotificationQueue(payload);
    }
}
