package com.foodagram.files.entity;

import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "files",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "file_name_unique",
                        columnNames = {"file_name"}
                )
        }
)
@Builder
public class Files extends BaseEntity {
    private String fileName;
    private String filePath;
    private String contentType;
    private Long fileSize;
    private String ownerService;
    private String ownerEntity;
    private String ownerId;
}
