package com.foodagram.auth.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.foodagram.clients.users.enums.TokenType;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "token")
@Getter
@Setter
public class Token {

    @Id
    @SequenceGenerator(
            name = "token_id_seq",
            sequenceName = "token_id_seq",
            initialValue = 1,
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "token_id_seq"
    )
    public Long id;

    @Column(unique = true)
    public String token;

    @Enumerated(EnumType.STRING)
    public TokenType tokenType = TokenType.BEARER;

    public boolean revoked;

    public boolean expired;

    @OnDelete(action = OnDeleteAction.NO_ACTION)
    public Integer userId;

}

