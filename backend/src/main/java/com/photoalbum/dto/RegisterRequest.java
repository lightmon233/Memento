package com.photoalbum.dto;

import lombok.Data;

import javax.persistence.Entity;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
}
