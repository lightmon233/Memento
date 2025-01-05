package com.photoalbum.repository;

import com.photoalbum.model.Album;
import com.photoalbum.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByAlbumId(Long albumId);
    List<Photo> findByAlbumIn(Collection<Album> album);
}