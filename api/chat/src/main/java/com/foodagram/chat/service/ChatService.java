package com.foodagram.chat.service;

import com.foodagram.chat.domain.Conversation;
import com.foodagram.chat.domain.Message;
import com.foodagram.chat.rabbitmq.ChatAMQPService;
import com.foodagram.chat.repository.ConversationRepository;
import com.foodagram.chat.repository.MessageRepository;
import com.foodagram.clients.chat.dto.ChatMessageDto;
import com.foodagram.clients.chat.dto.ConversationDto;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
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

    private final ChatAMQPService amqp;

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

        amqp.publishMessageCreated(
                new GenericRabbitMQMessage(
                        "chatMessageCreated",
                        ChatMessageDto.builder()
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


    public List<ChatMessageDto> getLast50(UUID conversationId, UUID myId) {
        Conversation conv = convRepo.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        UUID otherId = myId.equals(conv.getParticipantA())
                ? conv.getParticipantB()
                : conv.getParticipantA();

        List<Message> msgs = msgRepo.findTop50ByConversationOrderByCreatedDateAsc(conv);

        return msgs.stream()
                .map(m -> ChatMessageDto.builder()
                        .conversationId(conv.getId())
                        .senderId(m.getSenderId())
                        .receiverId(m.getSenderId().equals(myId) ? otherId : myId) // fixed logic here
                        .content(m.getContent())
                        .timestamp(m.getCreatedDate().toInstant(ZoneOffset.UTC))
                        .build())
                .toList();
    }
}
