package com.foodagram.chat.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.foodagram.chat.domain.Conversation;
import com.foodagram.chat.domain.Message;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    Long countByConversationAndReadFalseAndSenderIdNot(Conversation conv, UUID userId);
    Optional<Message> findTop1ByConversationOrderByCreatedDateDesc(Conversation conv);

    List<Message> findTop50ByConversationOrderByCreatedDateAsc(Conversation conv);
}
