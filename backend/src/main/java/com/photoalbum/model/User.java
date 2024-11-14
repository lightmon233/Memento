package com.photoalbum.model;

import lombok.Data;
import javax.persistence.*;
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
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Album> albums;
}