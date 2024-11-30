package com.photoalbum.controller;

import com.photoalbum.dto.PhotoRequest;
import com.photoalbum.model.Album;
import com.photoalbum.model.Photo;
import com.photoalbum.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {
    @Autowired
    private PhotoService photoService;

    @PostMapping
    public ResponseEntity<?> uploadPhoto(@ModelAttribute PhotoRequest photoRequest) {
        MultipartFile file = photoRequest.getFile();
        String url = "url";
        if (file != null && !file.isEmpty()) {
            try {
                url = photoService.uploadPhoto(file);
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        }
        Photo photo = new Photo();
        photo.setTitle(photoRequest.getTitle());
        Album album = new Album();
        album.setId(photoRequest.getAlbumId());
        photo.setAlbum(album);
        photo.setUrl(url);
        try {
            return ResponseEntity.ok(photoService.savePhoto(photo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/album/{albumId}")
    public ResponseEntity<?> getAlbumPhotos(@PathVariable Long albumId) {
        return ResponseEntity.ok(photoService.getAlbumPhotos(albumId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable Long id) {
        photoService.deletePhoto(id);
        return ResponseEntity.ok().build();
    }

    // 新增 getPhoto 方法
    @GetMapping("/{id}")
    public ResponseEntity<?> getPhoto(@PathVariable Long id) {
        try {
            Photo photo = photoService.getPhoto(id); // 假设 photoService 提供了 getPhoto 方法
            if (photo == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(photo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving photo: " + e.getMessage());
        }
    }
}