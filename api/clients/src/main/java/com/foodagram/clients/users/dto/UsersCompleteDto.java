package com.foodagram.clients.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.foodagram.clients.users.profile.UsersProfileDto;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsersCompleteDto {
    private UsersDto user;
    private UsersProfileDto profile;
}
