package com.photoalbum.service;

import com.photoalbum.model.Album;
import com.photoalbum.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
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

    public void deleteAlbum(Long id) {
        albumRepository.deleteById(id);
    }
    
    public List<Album> getUserAlbums(Long userId) {
        List<Album> albums = albumRepository.findByUserId(userId);
        return albums != null ? albums : Collections.emptyList();
    }

    public Album getAlbum(Long id) {
        return albumRepository.findById(id).orElse(null);
    }
    
    public List<Album> getAlbumsByCategory(String category) {
        return albumRepository.findByCategory(category);
    }

    // 新增的 getAllAlbums 方法
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();  // 返回所有专辑
    }
    public void addCategory(String category) {
        // 业务逻辑：保存类别到数据库
    }

    public void updateCategory(String oldCategory, String newCategory) {
        // 业务逻辑：更新类别
    }

    public void deleteCategory(String category) {
        // 业务逻辑：删除类别
    }
}
