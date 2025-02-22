package com.foodagram.clients.users.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsersProfileUpdateDto {
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
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
}
