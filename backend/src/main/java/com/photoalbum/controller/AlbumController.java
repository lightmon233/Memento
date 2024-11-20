package com.photoalbum.controller;

import com.photoalbum.model.Album;
import com.photoalbum.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    @Autowired
    private AlbumService albumService;
    
    @PostMapping
    public ResponseEntity<?> createAlbum(@RequestBody Album album) {
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
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAlbums(@PathVariable Long userId) {
        return ResponseEntity.ok(albumService.getUserAlbums(userId));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getAlbumsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(albumService.getAlbumsByCategory(category));
    }
}
