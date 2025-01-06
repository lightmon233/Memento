package com.photoalbum.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "albums")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;  // 相册标题
    private String description;  // 相册描述
    private String category;  // 相册分类

    // 用户与相册之间的关系（相册拥有者）
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference // 防止循环引用
    private User user;

    // 相册和照片之间的关系（每个相册拥有多张照片）
//    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL)
//    @JsonManagedReference // 防止循环引用
//    private List<Photo> photos;

    // 创建时间，自动填充
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // 更新时间，自动填充
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 是否允许评论（默认为 true）
    private boolean allowComments = true;

    // 是否公开（默认为 true）
    @JsonProperty("isPublic")
    private boolean isPublic = true;

    // 是否启用（默认为 true）
    private boolean active = true;

    // 获取相册的状态信息（公开或私密）
    public String getStatus() {
        return isPublic ? "Public" : "Private";
    }
}