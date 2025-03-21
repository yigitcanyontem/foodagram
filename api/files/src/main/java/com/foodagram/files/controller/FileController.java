package com.foodagram.files.controller;

import com.foodagram.files.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

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
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileService.uploadFile(file);
        return ResponseEntity.ok("File uploaded: " + fileUrl);
    }

    // Download file
    @GetMapping("/{fileName}/download")
    public ResponseEntity<InputStream> downloadFile(@PathVariable String fileName) {
        InputStream fileStream = fileService.downloadFile(fileName);
        return ResponseEntity.ok().body(fileStream);
    }

    // Delete file
    @DeleteMapping("/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        fileService.deleteFile(fileName);
        return ResponseEntity.ok("File deleted: " + fileName);
    }

    // List files
    @GetMapping("/list")
    public ResponseEntity<?> listFiles() {
        return ResponseEntity.ok(fileService.listFiles());
    }
}
