package com.photoalbum.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private Long photoId;
}
