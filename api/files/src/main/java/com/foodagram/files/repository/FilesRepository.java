package com.foodagram.files.repository;

import com.foodagram.files.entity.Files;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface FilesRepository extends JpaRepository<Files, UUID> {
    List<Files> findByOwnerServiceAndOwnerEntityAndOwnerId(String ownerService, String ownerEntity, String ownerId);
}
