package com.photoalbum.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PhotoRequest {
    private String title;
    private Long albumId;
    private MultipartFile file;
}
