package com.photoalbum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class AlbumSettingsRequest {

    // Getters and Setters
    private Boolean isPublic; // 使用包装类型（Boolean），可以为 null
    private Boolean allowComments; // 使用包装类型（Boolean），可以为 null

}
