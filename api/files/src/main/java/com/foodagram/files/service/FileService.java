package com.foodagram.files.service;

import com.foodagram.clients.files.FilesDto;
import com.foodagram.files.entity.Files;
import com.foodagram.files.repository.FilesRepository;
import io.minio.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {
    private final MinioClient minioClient;
    private final FilesRepository fileRepository;

    @Value("${minio.bucketName}")
    private String bucketName;

    @PostConstruct
    public void createBucket() {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error creating bucket: " + e.getMessage());
        }
    }

    // Upload a file
    public FilesDto uploadFile(MultipartFile file, String ownerService, String ownerEntity, String ownerId, String fileName) {
        try {
            String filePath = bucketName + "/" + fileName;
            fileName = fileName.replaceAll(" ", "_");

            deleteIfExists(fileName);

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            String fileUrl = "http://localhost:9000/" + filePath;

            // Save file metadata in DB
            Files fileEntity = Files.builder()
                    .fileName(fileName)
                    .filePath(filePath)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .ownerService(ownerService)
                    .ownerEntity(ownerEntity)
                    .ownerId(ownerId)
                    .build();

            return convertToDto(fileRepository.save(fileEntity));
        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    public FilesDto getFile(UUID fileID) {
        try {
            Files file = fileRepository.findById(fileID)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            return FilesDto.builder()
                    .id(file.getId())
                    .fileName(file.getFileName())
                    .filePath(file.getFilePath())
                    .contentType(file.getContentType())
                    .fileSize(file.getFileSize())
                    .ownerService(file.getOwnerService())
                    .ownerEntity(file.getOwnerEntity())
                    .ownerId(file.getOwnerId())
                    .fileData(null)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching file: " + e.getMessage());
        }
    }


    public FilesDto downloadFile(UUID fileID) {
        try {
            Files file = fileRepository.findById(fileID)
                    .orElseThrow(() -> new RuntimeException("File not found"));
            GetObjectResponse response = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(file.getFileName())
                            .build()
            );

            return FilesDto.builder()
                    .id(file.getId())
                    .fileName(file.getFileName())
                    .filePath(file.getFilePath())
                    .contentType(file.getContentType())
                    .fileSize(file.getFileSize())
                    .ownerService(file.getOwnerService())
                    .ownerEntity(file.getOwnerEntity())
                    .ownerId(file.getOwnerId())
                    .fileData(response.readAllBytes())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file: " + e.getMessage());
        }
    }

    // Delete file from MinIO and DB
    public void deleteFile(UUID fileId) {
        try {
            Files file = fileRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(file.getFileName())
                            .build()
            );

            fileRepository.delete(file);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting file: " + e.getMessage());
        }
    }

    public void deleteFileByFileName(String fileName) {
        try {
            Files file = fileRepository.findByFileName(fileName)
                    .orElseThrow(() -> new RuntimeException("File not found: " + fileName));

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
            fileRepository.delete(file);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting file " + fileName + ": " + e.getMessage());
        }
    }


    private FilesDto convertToDto(Files file) {
        return FilesDto.builder()
                .id(file.getId())
                .fileName(file.getFileName())
                .filePath(file.getFilePath())
                .contentType(file.getContentType())
                .fileSize(file.getFileSize())
                .ownerService(file.getOwnerService())
                .ownerEntity(file.getOwnerEntity())
                .ownerId(file.getOwnerId())
                .build();
    }

    private void deleteIfExists(String fileName) {
        try {
            fileRepository.findByFileName(fileName)
                    .ifPresent(file -> {
                        try {
                            minioClient.removeObject(
                                    RemoveObjectArgs.builder()
                                            .bucket(bucketName)
                                            .object(fileName)
                                            .build()
                            );
                        } catch (Exception e) {
                            log.error("Error deleting file from MinIO: {}", e.getMessage());
                        }
                        fileRepository.delete(file);
                    });
        } catch (Exception e) {
            // Ignore if the file does not exist
        }
    }

}
