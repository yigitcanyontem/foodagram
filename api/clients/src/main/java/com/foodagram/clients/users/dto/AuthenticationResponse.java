package com.foodagram.clients.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
  private String accessToken;
  private String refreshToken;
  private UsersDto user;

 public AuthenticationResponse(String accessToken, String refreshToken, Integer id) {
     this.accessToken = accessToken;
     this.refreshToken = refreshToken;
 }
}
