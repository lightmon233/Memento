package com.photoalbum.controller;

import com.photoalbum.dto.AlbumRequest;
import com.photoalbum.model.Album;
import com.photoalbum.model.User;
import com.photoalbum.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    @Autowired
    private AlbumService albumService;
    
    @PostMapping
    public ResponseEntity<?> createAlbum(@RequestBody AlbumRequest request) {
        // 使用userId构造一个User对象
        User user = new User();
        user.setId(request.getUserId());
        // 创建一个新的Album对象
        Album album = new Album();
        album.setTitle(request.getTitle());
        album.setDescription(request.getDescription());
        album.setCategory(request.getCategory());
        album.setUser(user); // 设置user用户
        // 保存album
        return ResponseEntity.ok(albumService.createAlbum(album));
    }

    @GetMapping
    public ResponseEntity<?> getAllAlbums() {
        return ResponseEntity.ok(albumService.getAllAlbums());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAlbum(@PathVariable Long id, @RequestBody Album album) {
        album.setId(id);
        return ResponseEntity.ok(albumService.updateAlbum(album));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAlbums(@PathVariable Long userId) {
        try {
            List<Album> albums = albumService.getUserAlbums(userId);
            return ResponseEntity.ok(albums);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to fetch albums"));
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getAlbumsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(albumService.getAlbumsByCategory(category));
    }

    // 新增类别管理功能
    @PreAuthorize("hasRole('ADMIN')") // 仅管理员角色可访问
    @PostMapping("/category")
    public ResponseEntity<?> addCategory(@RequestBody String category) {
        try {
            albumService.addCategory(category); // 调用服务层方法添加类别
            return ResponseEntity.status(HttpStatus.CREATED).body("Category added successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to add category."));
        }
    }

    @PreAuthorize("hasRole('ADMIN')") // 仅管理员角色可访问
    @PutMapping("/category/{oldCategory}")
    public ResponseEntity<?> updateCategory(@PathVariable String oldCategory, @RequestBody String newCategory) {
        try {
            albumService.updateCategory(oldCategory, newCategory); // 调用服务层方法更新类别
            return ResponseEntity.ok("Category updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to update category."));
        }
    }

    @PreAuthorize("hasRole('ADMIN')") // 仅管理员角色可访问
    @DeleteMapping("/category/{category}")
    public ResponseEntity<?> deleteCategory(@PathVariable String category) {
        try {
            albumService.deleteCategory(category); // 调用服务层方法删除类别
            return ResponseEntity.ok("Category deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to delete category."));
        }
    }
}
