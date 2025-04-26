package com.foodagram.content.domain;

import com.foodagram.clients.content.enums.ReportReason;
import com.foodagram.clients.content.enums.ReportType;
import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Report extends BaseEntity {

    // Reporter details
    @Column(name = "reporter_id", nullable = false)
    private UUID reporterId;

    @Column(name = "reporter_username", nullable = false)
    private String reporterUsername;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType reportType;

    // ID of the reported post/comment/user
    @Column(name = "reported_entity_id", nullable = false)
    private UUID reportedEntityId;

    // Reason for reporting
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportReason reason;

    // Status of the report (resolved or pending)
    @Column(nullable = false)
    private boolean isResolved = false;

    // Additional notes or comments from the reporter
    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    // Timestamp when the report was resolved (if applicable)
    @Column(name = "resolved_at")
    private Long resolvedAt;

}

