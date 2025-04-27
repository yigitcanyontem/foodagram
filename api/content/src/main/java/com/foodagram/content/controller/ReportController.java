package com.foodagram.content.controller;

import com.foodagram.clients.content.dto.ReportCreationDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.enums.Role;
import com.foodagram.content.service.ReportResponseDto;
import com.foodagram.content.service.ReportService;
import com.foodagram.content.util.UsersUtil;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    private final UsersUtil usersUtil;

    @PostMapping()
    public ResponseEntity<ReportResponseDto> createReport(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestBody ReportCreationDto reportCreationDto) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            return ResponseEntity.ok(reportService.createReport(user, reportCreationDto));
        } catch (Exception e) {
            log.error("Error while creating report by id: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to get a report by its ID
    @GetMapping("/{id}")
    public ResponseEntity<ReportResponseDto> getReportById(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable("id") UUID reportId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            throwIfNotAdmin(user);
            return ResponseEntity.ok(reportService.getById(reportId));
        } catch (Exception e) {
            log.error("Error while getting report by id: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to get all unresolved reports
    @GetMapping("/unresolved")
    public ResponseEntity<List<ReportResponseDto>> getAllUnresolvedReports(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            throwIfNotAdmin(user);
            return ResponseEntity.ok(reportService.getAllUnresolvedReports());
        } catch (Exception e) {
            log.error("Error while getting unresolved reports: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ReportResponseDto> resolveReport(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @PathVariable("id") UUID reportId) {
        try {
            UsersDto user = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            throwIfNotAdmin(user);
            return ResponseEntity.ok(reportService.resolveReport(reportId, user.getId()));
        } catch (Exception e) {
            log.error("Error while resolving report: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void throwIfNotAdmin(UsersDto user) {
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new IllegalArgumentException("User is not an admin");
        }
    }
}
