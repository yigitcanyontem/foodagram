package com.foodagram.content.controller;

import com.foodagram.clients.shared.dto.GenericResponse;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.content.service.FileService;
import com.foodagram.content.util.UsersUtil;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/content-media")
@RequiredArgsConstructor
@Slf4j
public class FileController {
    private final FileService fileService;
    private final UsersUtil usersUtil;

    @PostMapping("/upload")
    public ResponseEntity<GenericResponse> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
    ) {
        try {
            UsersDto usersDto = usersUtil.throwIfJwtTokenIsInvalidElseReturnUser(jwtToken);
            GenericResponse genericResponse = new GenericResponse();
            genericResponse.setData(fileService.uploadMedia(file,usersDto));
            genericResponse.setMessage("Successfully uploaded media");
            return new ResponseEntity<>(genericResponse, HttpStatus.OK);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
