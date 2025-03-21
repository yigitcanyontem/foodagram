package com.foodagram.clients.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFollowDto {
    private UUID userId;
    private UUID engagedUserId;
    private boolean followed;
}
