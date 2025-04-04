package com.foodagram.clients.files;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@FeignClient(
        name = "files"
)
public interface FilesClient {
    @PostMapping(path = "api/v1/files/upload", consumes = "multipart/form-data")
    ResponseEntity<FilesDto> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestParam("ownerService") String ownerService,
            @RequestParam("ownerEntity") String ownerEntity,
            @RequestParam("ownerId") String ownerId,
            @RequestParam("fileName") String fileName
    );

    @GetMapping("api/v1/files/{fileID}/download")
    ResponseEntity<FilesDto> downloadFile(@PathVariable("fileID") UUID fileId);

    @DeleteMapping("api/v1/files/{fileId}")
    ResponseEntity<String> deleteFile(@PathVariable("fileId") UUID fileId);
}
