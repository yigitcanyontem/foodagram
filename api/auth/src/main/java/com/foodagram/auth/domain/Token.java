package com.foodagram.auth.domain;

import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.foodagram.clients.users.enums.TokenType;

import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "token")
@Getter
@Setter
public class Token extends BaseEntity {


    @Column(unique = true)
    public String token;

    @Enumerated(EnumType.STRING)
    public TokenType tokenType = TokenType.BEARER;

    public boolean revoked;

    public boolean expired;

    @OnDelete(action = OnDeleteAction.NO_ACTION)
    public UUID userId;

}

