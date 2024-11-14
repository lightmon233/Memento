package com.photoalbum.service;

import com.photoalbum.model.Photo;
import com.photoalbum.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoService {
    @Autowired
    private PhotoRepository photoRepository;
    
    private final Path rootLocation = Paths.get("uploads");
    
    public Photo uploadPhoto(MultipartFile file, Photo photo) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), rootLocation.resolve(filename));
        
        photo.setFilePath(filename);
        photo.setUploadTime(LocalDateTime.now());
        return photoRepository.save(photo);
    }
    
    public List<Photo> getAlbumPhotos(Long albumId) {
        return photoRepository.findByAlbumId(albumId);
    }
    
    public void deletePhoto(Long id) {
        photoRepository.deleteById(id);
    }
}