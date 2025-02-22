package com.foodagram.clients.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenericResponse {
    private String message;
    private Object data;
    private boolean success;
}
