package com.photoalbum.service;

import com.photoalbum.dto.AlbumSettingsRequest;
import com.photoalbum.model.Album;
import com.photoalbum.model.User;
import com.photoalbum.repository.AlbumRepository;
import com.photoalbum.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;  // 用于判断是否是管理员或相册拥有者

    // 创建新相册
    public Album createAlbum(Album album, Long userId) {
        User user = userService.findById(userId);
        album.setUser(user);  // 设置相册的拥有者
        return albumRepository.save(album);
    }

    // 更新相册（权限检查）
    public Album updateAlbum(Album album, Long userId) {
        // 获取当前相册
        Album existingAlbum = albumRepository.findById(album.getId()).orElseThrow(() -> new RuntimeException("Album not found"));

        // 如果用户不是相册的拥有者并且不是管理员，抛出权限异常
        if (!isAuthorizedToModify(existingAlbum, userId)) {
            throw new RuntimeException("You do not have permission to modify this album.");
        }

        // 更新并保存相册
        existingAlbum.setAllowComments(album.isAllowComments());
        existingAlbum.setPublic(album.isPublic());
        return albumRepository.save(existingAlbum);
    }

    // 判断用户是否有权限修改相册
    private boolean isAuthorizedToModify(Album album, Long userId) {
        // 权限检查：只有相册的拥有者和管理员可以修改
        return album.getUser().getId().equals(userId) || isAdmin(userId);
    }

    // 判断是否是管理员
    private boolean isAdmin(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRole().equals("ADMIN");  // 假设你有角色字段来判断是否为管理员
    }

    // 删除相册
    public void deleteAlbum(Long id, Long userId) {
        Album album = albumRepository.findById(id).orElseThrow(() -> new RuntimeException("Album not found"));


        // 如果用户不是相册的拥有者并且不是管理员，抛出权限异常
        if (!isAuthorizedToModify(album, userId)) {
            throw new RuntimeException("You do not have permission to delete this album.");
        }

        albumRepository.deleteById(id);
    }

    // 获取某个用户的所有相册
    public List<Album> getUserAlbums(Long userId) {
        List<Album> albums = albumRepository.findByUserId(userId);
        return albums != null ? albums : Collections.emptyList();
    }

    // 获取单个相册
    public Album getAlbum(Long id) {
        return albumRepository.findById(id).orElse(null);
    }

    // 根据类别获取相册
    public List<Album> getAlbumsByCategory(String category) {
        return albumRepository.findByCategory(category);
    }

    // 获取所有相册
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();  // 返回所有相册
    }

    // 权限检查方法，判断用户是否可以修改相册


    // 添加类别
    public void addCategory(String category) {
        // 业务逻辑：保存类别到数据库
    }

    // 更新类别
    public void updateCategory(String oldCategory, String newCategory) {
        // 业务逻辑：更新类别
    }

    // 删除类别
    public void deleteCategory(String category) {
        // 业务逻辑：删除类别
    }

    // 保存或更新相册
    public Album save(Album album) {
        return albumRepository.save(album);  // 调用 save 方法进行持久化
    }

    // 更新相册设置（公开性和评论权限）
    public Album updateAlbumSettings(Long albumId, AlbumSettingsRequest settingsRequest) {
        // 获取相册

        System.out.println("Received request to update album with ID: " + albumId);
        System.out.println("New isPublic value: " + settingsRequest.getIsPublic());
        System.out.println("New allowComments value: " + settingsRequest.getAllowComments());


        Album album = albumRepository.findById(albumId).orElseThrow(() -> new RuntimeException("Album not found"));

        // 更新公开性和评论权限
        if (settingsRequest.getIsPublic() != null) {
            album.setPublic(settingsRequest.getIsPublic());
        }

        if (settingsRequest.getAllowComments() != null) {
            album.setAllowComments(settingsRequest.getAllowComments());
        }

        // 保存更新后的相册
        return albumRepository.save(album);
    }
}
