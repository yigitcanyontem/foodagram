package com.foodagram.clients.content.dto;

import com.foodagram.clients.content.enums.ReportReason;
import com.foodagram.clients.content.enums.ReportType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportCreationDto {
    private UUID reporterId;
    private String reporterUsername;
    private ReportType reportType;
    private UUID reportedEntityId;
    private ReportReason reason;
    private String additionalNotes;
}
