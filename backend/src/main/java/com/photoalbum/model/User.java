package com.photoalbum.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    private String email;

    private boolean isAdmin;

    private String role;

    // 添加 setActive 方法
    // 添加 getActive 方法
    // 用户是否启用
    @Setter
    @Getter
    private boolean active;  // true = 启用, false = 禁用

    @Getter
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    // 在用户实体保存之前自动设置创建时间
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // 添加 getRole 方法
    public String getRole() {
        return isAdmin ? "ADMIN" : "USER";
    }

}