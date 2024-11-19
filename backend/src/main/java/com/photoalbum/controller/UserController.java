package com.photoalbum.controller;

import com.photoalbum.model.RegisterRequest;
import com.photoalbum.model.User;
import com.photoalbum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.photoalbum.util.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil; // 注入JwtUtil

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            // 检查密码是否匹配
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }
            // 创建用户对象
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setAdmin(false);
            // 调用UserService注册用户
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        // 认证逻辑
        try {
            // 使用UserService验证用户名和密码
            User authenticatedUser = userService.authenticateUser(user.getUsername(), user.getPassword());
            if (authenticatedUser != null) {
                // 如果认证成功，生成JWT令牌
                String token = jwtUtil.generateToken(authenticatedUser);
                return ResponseEntity.ok(token); // 返回 JWT 令牌
            } else {
                return ResponseEntity.status(401).body("Invalid username or password"); // 用户名或密码错误
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed" + e.getMessage());
        }
    }
}