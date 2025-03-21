package com.foodagram.clients.files;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FilesDto {
    private UUID id;
    private String fileName;
    private String filePath;
    private String contentType;
    private Long fileSize;
    private String ownerService;
    private String ownerEntity;
    private String ownerId;
    private LocalDateTime createdDate;
    private byte[] fileData;
}
