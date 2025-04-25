package com.foodagram.content.service;

import com.foodagram.clients.files.FilesClient;
import com.foodagram.clients.files.FilesDto;
import com.foodagram.clients.users.dto.UsersDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    private final FilesClient filesClient;

    public String uploadMedia(MultipartFile file, UsersDto usersDto) {
        try {
            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();
            String extension = "";

            // Primary check via contentType
            if (contentType != null) {
                if (contentType.contains("video") || contentType.equalsIgnoreCase("image/mp4")) {
                    extension = ".mp4";
                } else if (contentType.contains("image")) {
                    extension = ".jpg";
                }
            }


            if (extension.isEmpty() && originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }


            String filename = UUID.randomUUID().toString() + extension;
            String filePath = "content/media/" + usersDto.getId() + "/" + filename;

            FilesDto filesDto = filesClient.uploadFile(
                    file,
                    "content",
                    "Post",
                    usersDto.getId().toString(),
                    filePath
            ).getBody();

            if (filesDto != null) {
                return filesDto.getFilePath();
            } else {
                log.error("Error uploading media: File upload failed");
            }
        } catch (Exception e) {
            log.error("Error uploading media: {}", e.getMessage());
        }
        return null;
    }
}


