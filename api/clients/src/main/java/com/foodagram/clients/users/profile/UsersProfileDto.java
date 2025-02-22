package com.foodagram.clients.users.profile;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsersProfileDto {
    private Integer id;
    private Integer usersId;
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
    private Date createdAt;
    private String linkedinProfile;
    private String githubProfile;
    private String mediumProfile;
    private long followingCount;
    private long followersCount;
}
