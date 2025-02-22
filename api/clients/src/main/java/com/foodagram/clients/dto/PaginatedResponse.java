package com.foodagram.clients.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginatedResponse {
    private Object data;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
