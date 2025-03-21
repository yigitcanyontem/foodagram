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
    private String profilePictureUrl;
    private String bannerPictureUrl;
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
}
