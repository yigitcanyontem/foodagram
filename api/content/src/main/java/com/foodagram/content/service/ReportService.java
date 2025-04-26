package com.foodagram.content.service;

import com.foodagram.clients.content.dto.ReportCreationDto;
import com.foodagram.clients.content.enums.ReportReason;
import com.foodagram.clients.content.enums.ReportType;
import com.foodagram.clients.notification.NotificationCreateDto;
import com.foodagram.clients.notification.dto.NotificationType;
import com.foodagram.clients.shared.dto.GenericRabbitMQMessage;
import com.foodagram.clients.users.UsersClient;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.content.domain.Comment;
import com.foodagram.content.domain.Like;
import com.foodagram.content.domain.Post;
import com.foodagram.content.domain.Report;
import com.foodagram.content.rabbitmq.AMQPService;
import com.foodagram.content.repository.CommentRepository;
import com.foodagram.content.repository.LikeRepository;
import com.foodagram.content.repository.PostRepository;
import com.foodagram.content.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final UsersClient usersClient;
    private final CommentRepository commentRepository;
    private final AMQPService amqpService;

    @Transactional
    public ReportResponseDto createReport(UsersDto usersDto, ReportCreationDto reportCreationDto) {
        // Step 1: Validate if the entity exists (Post, Comment, or User)
        switch (reportCreationDto.getReportType()) {
            case POST:
                Post post = postRepository.findById(reportCreationDto.getReportedEntityId())
                        .orElseThrow(() -> new IllegalArgumentException("Post not found"));
                break;
            case COMMENT:
                Comment comment = commentRepository.findById(reportCreationDto.getReportedEntityId())
                        .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
                break;
            case USER:
                UsersProfileDto userProfile = usersClient.getUserProfileByUserId(reportCreationDto.getReportedEntityId());
                break;
            default:
                throw new IllegalArgumentException("Invalid report type");
        }

        // Step 2: Create the report
        Report report = Report.builder()
                .reporterId(usersDto.getId())
                .reportType(reportCreationDto.getReportType())
                .reportedEntityId(reportCreationDto.getReportedEntityId())
                .reason(reportCreationDto.getReason())
                .additionalNotes(reportCreationDto.getAdditionalNotes())
                .isResolved(false)
                .build();

        // Save the report to the database
        Report savedReport = reportRepository.save(report);
        log.info("Report created successfully: {}", savedReport);

        // Step 3: Send a notification about the report (optional)
        sendReportNotification(savedReport);

        return mapToDto(savedReport);
    }

    private void sendReportNotification(Report report) {
        GenericRabbitMQMessage notificationMessage = new GenericRabbitMQMessage();
        notificationMessage.setMessage(new NotificationCreateDto(
                true,
                "A new report has been created.",
                "A new report has been created.",
                NotificationType.REPORT
        ));

        try {
            amqpService.publishToNotificationQueue(notificationMessage);
            log.info("Notification sent for report: {}", report.getId());
        } catch (Exception e) {
            log.error("Error sending report notification: ", e);
        }
    }

    // Method to get a report by its ID
    public ReportResponseDto getById(UUID reportId) {
        // Step 1: Find the report by ID
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        // Step 2: Map the report entity to the response DTO
        return new ReportResponseDto(
                report.getId(),
                report.getReporterId(),
                report.getReporterUsername(),
                report.getReportType(),
                report.getReportedEntityId(),
                report.getReason(),
                report.getAdditionalNotes(),
                report.isResolved()
        );
    }

    // Method to get all unresolved reports
    public List<ReportResponseDto> getAllUnresolvedReports() {
        // Step 1: Fetch all unresolved reports
        List<Report> unresolvedReports = reportRepository.findByResolved(false);

        // Step 2: Map the reports to response DTOs
        return unresolvedReports.stream()
                .map(report -> new ReportResponseDto(
                        report.getId(),
                        report.getReporterId(),
                        report.getReporterUsername(),
                        report.getReportType(),
                        report.getReportedEntityId(),
                        report.getReason(),
                        report.getAdditionalNotes(),
                        report.isResolved()
                ))
                .collect(Collectors.toList());
    }

    public ReportResponseDto mapToDto(Report report) {
        return new ReportResponseDto(
                report.getId(),
                report.getReporterId(),
                report.getReporterUsername(),
                report.getReportType(),
                report.getReportedEntityId(),
                report.getReason(),
                report.getAdditionalNotes(),
                report.isResolved()
        );
    }

}
