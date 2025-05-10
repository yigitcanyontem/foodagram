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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    Long countByConversationAndReadFalseAndSenderIdNot(Conversation conv, UUID userId);

    Optional<Message> findTop1ByConversationOrderByCreatedDateDesc(Conversation conv);

    @Query("""
      SELECT m 
      FROM Message m 
      WHERE m.conversation = :conversation 
      ORDER BY m.createdDate DESC 
      """)
    List<Message> findMessagesByConversationWithPagination(
            @Param("conversation") Conversation conversation,
            Pageable pageable);


    @Transactional
    @Modifying
    @Query("update Message m set m.deleted = true, m.content = 'Message deleted' " +
            "where m.id = :id and m.senderId = :sender")
    int softDelete(@Param("id") UUID id, @Param("sender") UUID senderId);
}