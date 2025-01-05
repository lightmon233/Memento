package com.photoalbum.service;

import com.photoalbum.model.User;
import com.photoalbum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 注册用户，如果用户名已存在，抛出异常
     * @param user
     * @return
     */
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        // 使用 PasswordEncoder 对密码进行加密
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // 默认普通用户，管理员手动设置
        if (user.getRole() == null) {
            user.setRole("USER");  // 默认角色是普通用户
        }
        return userRepository.save(user);
    }

    /**
     * 根据用户名查找用户
     * @param username
     * @return
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * 根据用户 ID 查找用户
     * @param userId
     * @return
     */
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * 验证用户身份，检查用户名和密码
     * @param username
     * @param password
     * @return
     */
    public User authenticateUser(String username, String password) {
        User user = findByUsername(username);
        // 使用 PasswordEncoder 验证密码
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    /**
     * 检查用户是否是管理员
     * @param username
     * @return
     */
    public boolean isAdmin(String username) {
        User user = findByUsername(username);
        return "ADMIN".equals(user.getRole());
    }

    /**
     * 管理员禁用用户账户
     * @param adminUsername
     * @param username
     * @return
     */
    public String disableUser(String adminUsername, String username) {
        if (!isAdmin(adminUsername)) {
            throw new RuntimeException("Only admins can disable users");
        }

        User user = findByUsername(username);
        if (user != null) {
            user.setActive(false);  // 禁用用户
            userRepository.save(user);
            return "User " + username + " has been disabled";
        }
        return "User not found";
    }

    /**
     * 启用用户账户
     * @param adminUsername
     * @param username
     * @return
     */
    public String enableUser(String adminUsername, String username) {
        if (!isAdmin(adminUsername)) {
            throw new RuntimeException("Only admins can enable users");
        }

        User user = findByUsername(username);
        if (user != null) {
            user.setActive(true);  // 启用用户
            userRepository.save(user);
            return "User " + username + " has been enabled";
        }
        return "User not found";
    }

    /**
     * 更新用户角色为管理员
     * @param adminUsername
     * @param username
     * @return
     */
    public String promoteToAdmin(String adminUsername, String username) {
        if (!isAdmin(adminUsername)) {
            throw new RuntimeException("Only admins can promote users to admin");
        }

        User user = findByUsername(username);
        if (user != null) {
            user.setRole("ADMIN");  // 将用户角色设置为管理员
            userRepository.save(user);
            return "User " + username + " has been promoted to admin";
        }
        return "User not found";
    }

    /**
     * 取消管理员权限
     * @param adminUsername
     * @param username
     * @return
     */
    public String demoteFromAdmin(String adminUsername, String username) {
        if (!isAdmin(adminUsername)) {
            throw new RuntimeException("Only admins can demote users from admin");
        }

        User user = findByUsername(username);
        if (user != null && !"admin".equals(user.getRole())) {
            user.setRole("USER");  // 将用户角色恢复为普通用户
            userRepository.save(user);
            return "User " + username + " has been demoted from admin";
        }
        return "User not found or user is already a regular user";
    }
}