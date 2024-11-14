package com.photoalbum.controller;

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
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file, @RequestBody Photo photo) {
        try {
            return ResponseEntity.ok(photoService.uploadPhoto(file, photo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload photo");
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
}