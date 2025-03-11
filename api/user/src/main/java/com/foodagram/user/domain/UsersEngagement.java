package com.foodagram.user.domain;


import jakarta.persistence.*;
import lombok.*;
import com.foodagram.clients.users.enums.UserEngagementType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "users_engagement",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unique_user_engagement",
                        columnNames = {"user_id", "engaged_user_id", "user_engagement_type"}
                )
        }
)
@Builder
public class UsersEngagement {
    @Id
    @SequenceGenerator(
            name = "users_id_sequence",
            sequenceName = "users_id_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "users_id_sequence"
    )
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "engaged_user_id", nullable = false)
    private Integer engagedUserId;

    @Column(name = "user_engagement_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserEngagementType userEngagementType;
}
