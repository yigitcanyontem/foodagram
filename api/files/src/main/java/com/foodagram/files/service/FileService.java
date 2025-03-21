package com.foodagram.files.service;

import com.foodagram.files.entity.Files;
import com.foodagram.files.repository.FilesRepository;
import io.minio.*;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    private final MinioClient minioClient;
    private final FilesRepository fileRepository;

    @Value("${minio.bucketName}")
    private String bucketName;

    // Ensure the bucket exists
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
    public Files uploadFile(MultipartFile file, String ownerService, String ownerEntity, String ownerId) {
        try {
            String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = bucketName + "/" + uniqueFileName;
            uniqueFileName = uniqueFileName.replaceAll(" ", "_");

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(uniqueFileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            String fileUrl = "http://localhost:9000/" + filePath;

            // Save file metadata in DB
            Files fileEntity = Files.builder()
                    .fileName(uniqueFileName)
                    .filePath(fileUrl)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .ownerService(ownerService)
                    .ownerEntity(ownerEntity)
                    .ownerId(ownerId)
                    .build();

            return fileRepository.save(fileEntity);
        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    // Get file by owner details
    public List<Files> getFilesByOwner(String ownerService, String ownerEntity, String ownerId) {
        return fileRepository.findByOwnerServiceAndOwnerEntityAndOwnerId(ownerService, ownerEntity, ownerId);
    }

    // Download file
    public InputStream downloadFile(String fileName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file: " + e.getMessage());
        }
    }

    // Delete file from MinIO and DB
    public void deleteFile(Long fileId) {
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

    // List all files from DB
    public List<Files> listFiles() {
        return fileRepository.findAll();
    }

}
