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
            FilesDto filesDto = filesClient.uploadFile(
                    file,
                    "content",
                    "Post",
                    usersDto.getId().toString(),
                    "content/media/"+usersDto.getId().toString()+"/"+ UUID.randomUUID().toString()
            ).getBody();

            if (filesDto != null) {
                return filesDto.getFilePath();
            } else {
                log.error("Error uploading media: File upload failed");
            }
        }catch (Exception e) {
            log.error("Error uploading media: {}", e.getMessage());
        }
        return null;
    }
}
