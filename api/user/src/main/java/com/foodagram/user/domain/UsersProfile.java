package com.foodagram.user.domain;

import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.foodagram.clients.users.dto.UserRegisterDTO;
import com.foodagram.clients.users.enums.Role;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "users_profile",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "user_id_unique",
                        columnNames = "usersId"
                )
        }
)
@Builder
public class UsersProfile extends BaseEntity {
    @OneToOne()
    @JoinColumn(
            name = "usersId",
            nullable = false
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Users usersId;

    private String firstName;
    private String lastName;
    private UUID profilePictureID;
    private String bio;
    private String city;
    private String country;
    private String website;
    private String jobTitle;
    private Date birthDate;
    private Date createdAt;
    private String instagramProfile;
    private String facebookProfile;
    private Integer followingCount;
    private Integer followersCount;
}
