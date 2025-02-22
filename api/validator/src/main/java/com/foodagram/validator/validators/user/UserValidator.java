package com.foodagram.validator.validators.user;


import com.foodagram.clients.users.dto.UserRegisterDTO;

public class UserValidator {

    public static void throwIfRegisterPayloadInvalid(UserRegisterDTO request) {
        if (!EmailValidator.isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Invalid email");
        }
        if (!PasswordValidator.isValidPassword(request.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        if (request.getUsername() == null || request.getUsername().length() < 3) {
            throw new IllegalArgumentException("Invalid username");
        }
    }
}
