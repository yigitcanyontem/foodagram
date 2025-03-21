package com.foodagram.files.controller;

import com.foodagram.files.entity.Files;
import com.foodagram.files.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
        this.fileService.createBucket();
    }

    // Upload file
    @PostMapping("/upload")
    public ResponseEntity<Files> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerService") String ownerService,
            @RequestParam("ownerEntity") String ownerEntity,
            @RequestParam("ownerId") String ownerId
    ) {
        Files fileEntity = fileService.uploadFile(file, ownerService, ownerEntity, ownerId);
        return ResponseEntity.ok(fileEntity);
    }

    // Get files by owner
    @GetMapping("/by-owner")
    public ResponseEntity<List<Files>> getFilesByOwner(
            @RequestParam("ownerService") String ownerService,
            @RequestParam("ownerEntity") String ownerEntity,
            @RequestParam("ownerId") String ownerId
    ) {
        return ResponseEntity.ok(fileService.getFilesByOwner(ownerService, ownerEntity, ownerId));
    }

    // Download file
    @GetMapping("/{fileName}/download")
    public ResponseEntity<InputStream> downloadFile(@PathVariable String fileName) {
        InputStream fileStream = fileService.downloadFile(fileName);
        return ResponseEntity.ok().body(fileStream);
    }

    // Delete file
    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable UUID fileId) {
        fileService.deleteFile(fileId);
        return ResponseEntity.ok("File deleted: " + fileId);
    }

    // List all files
    @GetMapping("/list")
    public ResponseEntity<List<Files>> listFiles() {
        return ResponseEntity.ok(fileService.listFiles());
    }
}
