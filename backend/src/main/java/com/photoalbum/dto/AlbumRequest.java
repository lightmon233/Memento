package com.photoalbum.dto;

import lombok.Data;

@Data
public class AlbumRequest {
    private String title;
    private String description;
    private String category;
    private Long userId; // 前端传递的userId
}
