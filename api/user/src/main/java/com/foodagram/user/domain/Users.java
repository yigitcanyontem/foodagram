package com.foodagram.user.domain;

import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import com.foodagram.clients.users.dto.UserRegisterDTO;
import com.foodagram.clients.users.enums.Role;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "users",
        uniqueConstraints = {
        @UniqueConstraint(
                name = "user_email_unique",
                columnNames = "email"
        ),
        @UniqueConstraint(
                name = "user_username_unique",
                columnNames = "username"
        )
    }
)
@Builder
public class Users extends BaseEntity {
    private String username;
    private String password;
    private String email;
    @Enumerated(EnumType.STRING)
    private Role role;
    private boolean enabled;
}
