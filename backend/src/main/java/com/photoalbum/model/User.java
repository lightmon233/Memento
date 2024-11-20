package com.photoalbum.model;

import lombok.Data;
import lombok.Getter;

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
    
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<Album> albums;

    // 添加 getCreatedAt 方法
    // 添加记录用户创建时间的字段
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