package com.foodagram.cache.hash;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.Date;

@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("users")
public class UsersHash {
    private Integer id;
    private String username;
    private String password;
    @Id
    private String email;
    private String role;
    private boolean enabled;
    private Date createdAt;
}
