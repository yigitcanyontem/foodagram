package com.foodagram.chat.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.foodagram.chat.domain.Conversation;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    Optional<Conversation> findByParticipantAAndParticipantBOrParticipantBAndParticipantA(UUID participantA, UUID participantB, UUID participantB2, UUID participantA2);
    List<Conversation> findByParticipantAOrParticipantBOrderByUpdatedDateDesc(UUID a, UUID b);
}
