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
@Table(name = "message")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Message extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(nullable = false)
    private Conversation conversation;
    @Column(nullable = false) private UUID senderId;
    @Column(nullable = false) private String content;
    private Boolean read = false;
}
