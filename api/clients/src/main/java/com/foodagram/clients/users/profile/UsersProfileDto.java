package com.foodagram.clients.users.profile;

import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsersProfileDto {
    private UUID id;
    private UUID usersId;
    private String firstName;
    private String lastName;
    private UUID profilePictureID;
    private String bio;
    private String city;
    private String country;
    private String website;
    private String jobTitle;
    private Date birthDate;
    private String instagramProfile;
    private String facebookProfile;
    private long followingCount;
    private long followersCount;
    private byte[] profilePicture;
}
