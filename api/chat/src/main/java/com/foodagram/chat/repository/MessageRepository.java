package com.foodagram.chat.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.foodagram.chat.domain.Conversation;
import com.foodagram.chat.domain.Message;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    Long countByConversationAndReadFalseAndSenderIdNot(Conversation conv, UUID userId);
    Optional<Message> findTop1ByConversationOrderByCreatedDateDesc(Conversation conv);

    List<Message> findTop50ByConversationOrderByCreatedDateAsc(Conversation conv);

    @Transactional
    @Modifying
    @Query("update Message m set m.deleted = true, m.content = 'Message deleted' " +
            "where m.id = :id and m.senderId = :sender")
    int softDelete(@Param("id") UUID id, @Param("sender") UUID senderId);
}
