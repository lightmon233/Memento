package com.photoalbum.controller;

import com.photoalbum.dto.CommentRequest;
import com.photoalbum.model.Comment;
import com.photoalbum.model.Photo;
import com.photoalbum.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;
    
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentRequest request) {
        Photo photo = new Photo();
        photo.setId(request.getPhotoId());
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPhoto(photo);
        return ResponseEntity.ok(commentService.addComment(comment));
    }
    
    @GetMapping("/photo/{photoId}")
    public ResponseEntity<?> getPhotoComments(@PathVariable Long photoId) {
        return ResponseEntity.ok(commentService.getPhotoComments(photoId));
    }
}