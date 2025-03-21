package com.foodagram.clients.users.dto;

import lombok.*;
import com.foodagram.clients.users.enums.Role;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UsersDto {
    private UUID id;
    private String username;
    private String email;
    private String password;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdDate;

    public UsersDto(UserRegisterDTO userRegisterDTO) {
        this.username = userRegisterDTO.getUsername();
        this.email = userRegisterDTO.getEmail();
    }
}
