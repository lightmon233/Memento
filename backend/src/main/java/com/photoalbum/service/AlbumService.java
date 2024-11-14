package com.photoalbum.service;

import com.photoalbum.model.Album;
import com.photoalbum.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbumService {
    @Autowired
    private AlbumRepository albumRepository;
    
    public Album createAlbum(Album album) {
        return albumRepository.save(album);
    }
    
    public Album updateAlbum(Album album) {
        if (!albumRepository.existsById(album.getId())) {
            throw new RuntimeException("Album not found");
        }
        return albumRepository.save(album);
    }
    
    public List<Album> getUserAlbums(Long userId) {
        return albumRepository.findByUserId(userId);
    }
    
    public List<Album> getAlbumsByCategory(String category) {
        return albumRepository.findByCategory(category);
    }
}