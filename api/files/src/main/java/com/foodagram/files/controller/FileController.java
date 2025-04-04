package com.foodagram.files.controller;

import com.foodagram.clients.files.FilesDto;
import com.foodagram.files.entity.Files;
import com.foodagram.files.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    // Upload file
    @PostMapping("/upload")
    public ResponseEntity<FilesDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerService") String ownerService,
            @RequestParam("ownerEntity") String ownerEntity,
            @RequestParam("ownerId") String ownerId,
            @RequestParam("fileName") String fileName
    ) {
        try {
            return ResponseEntity.ok(fileService.uploadFile(file, ownerService, ownerEntity, ownerId, fileName));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Download file
    @GetMapping("/{fileID}/download")
    public ResponseEntity<FilesDto> downloadFile(@PathVariable UUID fileID) {
        return ResponseEntity.ok().body(fileService.downloadFile(fileID));
    }

    // Delete file
    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable UUID fileId) {
        fileService.deleteFile(fileId);
        return ResponseEntity.ok("File deleted: " + fileId);
    }
}
