package com.foodagram.user.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodagram.clients.files.FilesClient;
import com.foodagram.clients.files.FilesDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.foodagram.clients.shared.dto.GenericResponse;
import com.foodagram.clients.users.dto.UserFollowDto;
import com.foodagram.clients.users.dto.UsersDto;
import com.foodagram.clients.users.profile.UsersProfileCreateDto;
import com.foodagram.clients.users.profile.UsersProfileDto;
import com.foodagram.clients.users.profile.UsersProfileUpdateDto;
import com.foodagram.user.domain.UsersProfile;
import com.foodagram.user.repository.UsersProfileRepository;
import com.foodagram.user.repository.UsersRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersProfileService {
    private final UsersProfileRepository usersProfileRepository;
    private final UsersRepository usersRepository;
    private final ObjectMapper objectMapper;
    private final FilesClient filesClient;

    public UsersProfileDto getUsersProfileByEmail(String email) {
        return mapDomainToDto(usersProfileRepository.findUsersProfileByUsersIdEmail(email).orElse(null));
    }

    public UsersProfileDto getUsersProfileByUsersId(UUID id) {
        return mapDomainToDto(usersProfileRepository.findUsersProfileByUsersIdId(id).orElse(null));
    }

    public boolean existsByUsersId(UUID id) {
        return usersProfileRepository.existsByUsersIdId(id);
    }

    public UsersProfile getByUsersID(UUID id) {
        return usersProfileRepository.findUsersProfileByUsersIdId(id).orElse(null);
    }

    public UsersProfileDto save(UsersProfileCreateDto createDto, UsersDto user) {
        if (existsByUsersId(user.getId())) {
            throw new IllegalArgumentException("User profile already exists");
        }

        UsersProfile usersProfile = createUsersProfileFromCreateDto(createDto, user.getId());
        usersProfile.setCreatedAt(new Date());
        return mapDomainToDto(usersProfileRepository.saveAndFlush(usersProfile));
    }

    public UsersProfileDto update(UsersProfileUpdateDto updateDto, UsersDto user) {
        UsersProfile existingProfile = getByUsersID(user.getId());

        if (existingProfile == null) {
            throw new IllegalArgumentException("User profile does not exist");
        }

        updateExistingProfile(existingProfile, updateDto);

        return mapDomainToDto(usersProfileRepository.saveAndFlush(existingProfile));
    }

    private UsersProfile createUsersProfileFromCreateDto(UsersProfileCreateDto createDto, UUID userId) {
        UsersProfile usersProfile = new UsersProfile();
        usersProfile.setUsersId(usersRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("User does not exist")
        ));
        usersProfile.setFirstName(createDto.getFirstName());
        usersProfile.setLastName(createDto.getLastName());
        usersProfile.setProfilePictureID(null);
        usersProfile.setBio(createDto.getBio());
        usersProfile.setCity(createDto.getCity());
        usersProfile.setCountry(createDto.getCountry());
        usersProfile.setWebsite(createDto.getWebsite());
        usersProfile.setJobTitle(createDto.getJobTitle());
        usersProfile.setBirthDate(createDto.getBirthDate());
        usersProfile.setFacebookProfile(createDto.getFacebookProfile());
        usersProfile.setInstagramProfile(createDto.getInstagramProfile());
        usersProfile.setFollowersCount(0);
        usersProfile.setFollowingCount(0);
        return usersProfile;
    }

    private void updateExistingProfile(UsersProfile existingProfile, UsersProfileUpdateDto updateDto) {
        existingProfile.setFirstName(updateDto.getFirstName());
        existingProfile.setLastName(updateDto.getLastName());
        existingProfile.setBio(updateDto.getBio());
        existingProfile.setCity(updateDto.getCity());
        existingProfile.setCountry(updateDto.getCountry());
        existingProfile.setWebsite(updateDto.getWebsite());
        existingProfile.setJobTitle(updateDto.getJobTitle());
        existingProfile.setBirthDate(updateDto.getBirthDate());
        existingProfile.setFacebookProfile(updateDto.getFacebookProfile());
        existingProfile.setInstagramProfile(updateDto.getInstagramProfile());
    }

    private UsersProfileDto mapDomainToDto(UsersProfile usersProfile) {
        if (usersProfile == null) {
            return null;
        }

        return UsersProfileDto.builder()
                .id(usersProfile.getId())
                .usersId(usersProfile.getUsersId().getId())
                .firstName(usersProfile.getFirstName())
                .lastName(usersProfile.getLastName())
                .profilePictureID(usersProfile.getProfilePictureID())
                .bio(usersProfile.getBio())
                .city(usersProfile.getCity())
                .country(usersProfile.getCountry())
                .website(usersProfile.getWebsite())
                .jobTitle(usersProfile.getJobTitle())
                .birthDate(usersProfile.getBirthDate())
                .instagramProfile(usersProfile.getInstagramProfile())
                .facebookProfile(usersProfile.getFacebookProfile())
                .followersCount(usersProfile.getFollowersCount() != null ? usersProfile.getFollowersCount() : 0)
                .followingCount(usersProfile.getFollowingCount() != null ? usersProfile.getFollowingCount() : 0)
                .profilePicture(getUserProfilePicture(usersProfile.getProfilePictureID()))
                .build();
    }

    private byte[] getUserProfilePicture(UUID profilePictureID) {
        try {
            if (profilePictureID == null) {
                return null;
            }

            return filesClient.downloadFile(profilePictureID).getBody().getFileData();
        }catch (Exception e) {
            log.error("Error while fetching user profile picture: {}", e.getMessage());
            return null;
        }
    }

    public void delete(UsersDto usersProfile) {
        usersProfileRepository.deleteByUsersIdId(usersProfile.getId());
    }

    public void updateFollowCount(UserFollowDto followDto) {
        UsersProfile usersProfile = getByUsersID(followDto.getUserId());
        UsersProfile engagedUsersProfile = getByUsersID(followDto.getEngagedUserId());

        if (followDto.isFollowed()) {
            engagedUsersProfile.setFollowersCount(
                    (engagedUsersProfile.getFollowersCount() != null ? engagedUsersProfile.getFollowersCount() : 0) + 1
            );

            usersProfile.setFollowingCount(
                    (engagedUsersProfile.getFollowingCount() != null ? engagedUsersProfile.getFollowingCount() : 0) + 1
            );
        } else {
            engagedUsersProfile.setFollowersCount(
                    (engagedUsersProfile.getFollowersCount() != null ? engagedUsersProfile.getFollowersCount() : 0) - 1
            );

            usersProfile.setFollowingCount(
                    (engagedUsersProfile.getFollowingCount() != null ? engagedUsersProfile.getFollowingCount() : 0) - 1
            );
        }
    }

    public void createDefaultProfile(UUID id) {
        UsersProfile usersProfile = new UsersProfile();
        usersProfile.setUsersId(usersRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("User does not exist")
        ));
        usersProfile.setFirstName("");
        usersProfile.setLastName("");
        usersProfile.setProfilePictureID(null);
        usersProfile.setBio("");
        usersProfile.setCity("");
        usersProfile.setCountry("");
        usersProfile.setWebsite("");
        usersProfile.setJobTitle("");
        usersProfile.setBirthDate(null);
        usersProfile.setFacebookProfile("");
        usersProfile.setInstagramProfile("");

        usersProfileRepository.saveAndFlush(usersProfile);
    }

    public void updateProfilePicture(UUID userId, UUID pictureId) {
        UsersProfile usersProfile = usersProfileRepository.findUsersProfileByUsersIdId(userId).orElseThrow(
                () -> new IllegalArgumentException("User does not exist")
        );
        usersProfile.setProfilePictureID(pictureId);
        usersProfileRepository.saveAndFlush(usersProfile);
    }

    public void uploadProfilePicture(MultipartFile file, UsersDto user) {
        try {
            FilesDto filesDto = filesClient.uploadFile(
                    file,
                    "users",
                    "UsersProfile",
                    user.getId().toString(),
                    "users/profile-picture/"+user.getId().toString()
            ).getBody();

            if (filesDto != null) {
                updateProfilePicture(user.getId(), filesDto.getId());
            } else {
                log.error("Error uploading profile picture: File upload failed");
            }
        }catch (Exception e) {
            log.error("Error uploading profile picture: {}", e.getMessage());
        }
    }
}
