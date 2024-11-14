package com.photoalbum.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "photos")
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String filePath;
    private LocalDateTime uploadTime;
    
    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;
    
    @OneToMany(mappedBy = "photo", cascade = CascadeType.ALL)
    private List<Comment> comments;
}