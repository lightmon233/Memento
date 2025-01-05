package com.photoalbum.service;

import com.photoalbum.model.Album;
import com.photoalbum.model.Photo;
import com.photoalbum.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
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

    @Autowired
    private AlbumService AlbumService;

    @Value("${nginx.upload.url}")
    private String nginxUrl;
    @Value("${nginx.download.url}")
    private String downloadUrl;
    
    private final Path rootLocation = Paths.get("uploads");
    
    public String uploadPhoto(MultipartFile file) throws IOException {
        // step1: generate unique filename
        // String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        // Files.copy(file.getInputStream(), rootLocation.resolve(filename));
        // step2: upload file to nginx server
        return uploadFileToNginx(file);
    }

    public String uploadFileToNginx(MultipartFile file) throws IOException {
        // step1: create rest template instance
        RestTemplate restTemplate = new RestTemplate();
        // step2: create multipart request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        // step3: create http entity
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        // step4: send request to nginx server
        ResponseEntity<String> response = restTemplate.exchange(
                nginxUrl,
                org.springframework.http.HttpMethod.POST,
                requestEntity,
                String.class
        );
        // step5: 处理响应
        if (response.getStatusCode().is2xxSuccessful()) {
            return downloadUrl + "/" + file.getOriginalFilename();
        } else {
            throw new IOException("Failed to upload file to Nginx server. Status: " + response.getStatusCode());
        }
    }

    public Photo savePhoto(Photo photo) {
        return photoRepository.save(photo);
    }
    
    public List<Photo> getAlbumPhotos(Long albumId) {
        return photoRepository.findByAlbumId(albumId);
    }
    
    public void deletePhoto(Long id) {
        photoRepository.deleteById(id);
    }

    public Photo getPhoto(Long id) {
        return photoRepository.findById(id).orElse(null);
    }

    public List<Photo> getPublicPhotos() {
        // 先获取所有public的相册
        // 然后获取这些相册的所有照片
        List<Album> albums = AlbumService.getPublicAlbums();
        return photoRepository.findByAlbumIn(albums);
    }
}