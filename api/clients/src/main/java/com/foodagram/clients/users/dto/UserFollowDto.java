package com.foodagram.clients.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFollowDto {
    private Integer userId;
    private Integer engagedUserId;
    private boolean followed;
}
