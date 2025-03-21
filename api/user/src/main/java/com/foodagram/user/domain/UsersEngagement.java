package com.foodagram.user.domain;


import com.foodagram.clients.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import com.foodagram.clients.users.enums.UserEngagementType;

import java.util.UUID;

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
public class UsersEngagement extends BaseEntity {
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "engaged_user_id", nullable = false)
    private UUID engagedUserId;

    @Column(name = "user_engagement_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserEngagementType userEngagementType;
}
