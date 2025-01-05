package com.photoalbum.controller;

import com.photoalbum.dto.CommentRequest;
import com.photoalbum.model.Album;
import com.photoalbum.model.Comment;
import com.photoalbum.model.Photo;
import com.photoalbum.model.User;
import com.photoalbum.repository.AlbumRepository;
import com.photoalbum.repository.CommentRepository;
import com.photoalbum.repository.PhotoRepository;
import com.photoalbum.repository.UserRepository;
import com.photoalbum.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PhotoRepository photoRepository;
    
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentRequest request) {
        // 获取对应的照片
        Photo photo = photoRepository.findById(request.getPhotoId())
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        // 获取照片所属的相册
        Album album = photo.getAlbum();  // 假设照片和相册是一对多关系，photo有getAlbum()方法

        // 检查相册是否公开且允许评论
        if (!album.isPublic() || !album.isAllowComments()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This album does not allow comments or is not public.");
        }

        // 查找用户并抛出异常
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 创建评论并设置用户和照片
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPhoto(photo);
        comment.setUser(user);

        // 保存评论并返回评论对象
        Comment savedComment = commentRepository.save(comment);

        // 返回评论信息，包括用户名
        return ResponseEntity.ok(savedComment);
    }






    @GetMapping("/photo/{photoId}")
    public ResponseEntity<?> getPhotoComments(@PathVariable Long photoId) {
        return ResponseEntity.ok(commentService.getPhotoComments(photoId));
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<?> getCommentById(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentService.getComment(commentId));
    }
}