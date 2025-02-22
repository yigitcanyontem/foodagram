package com.foodagram.clients.users.dto;

import com.foodagram.clients.users.profile.UsersProfileDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsersCompleteDto {
    private UsersDto user;
    private UsersProfileDto profile;
}
