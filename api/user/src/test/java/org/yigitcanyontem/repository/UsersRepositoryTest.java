package com.foodagram.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import com.foodagram.clients.users.enums.Role;
import com.foodagram.user.domain.Users;
import com.foodagram.user.repository.UsersRepository;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(
        properties = {
                "spring.jpa.properties.javax.persistence.validation.mode=none"
        }
)
public class UsersRepositoryTest {
    @Autowired
    private UsersRepository underTest;

    @BeforeEach
    void setUp() {
        underTest.deleteAll();
        underTest.save(new Users(
                null,
                "yigitcanyontem",
                "password",
                "yigitcanyontem@gmail.com",
                Role.ADMIN,
                true,
                new Date()
        ));

        underTest.save(new Users(
                null,
                "johndoe",
                "password",
                "johndoe@gmail.com",
                Role.ADMIN,
                true,
                new Date()
        ));

        underTest.save(new Users(
                null,
                "janedoe",
                "password",
                "janedoe@gmail.com",
                Role.USER,
                false,
                new Date()
        ));
    }

    @Test
    void itShouldSaveUsers() {

    }

    @Test
    void itShouldSelectUsersByEmail() {
        Users optionalUsers = underTest.findByUsername("yigitcanyontem");
        assertThat(optionalUsers)
                .isNotNull();

        assertThat(optionalUsers.getUsername())
                .isEqualTo("yigitcanyontem");
    }


}
