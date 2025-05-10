package com.foodagram.chat.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import com.foodagram.clients.shared.domain.BaseEntity;
import java.util.UUID;

@Entity
@Table(name = "conversation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Conversation extends BaseEntity {
    @Column(nullable = false) private UUID participantA;
    @Column(nullable = false) private UUID participantB;
    // helper for fast look‑ups
    public boolean involves(UUID userId) { return userId.equals(participantA) || userId.equals(participantB); }

    public UUID getOtherParticipant(UUID me) {
        return me.equals(participantA) ? participantB : participantA;
    }
}

