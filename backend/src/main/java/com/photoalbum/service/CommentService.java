package com.photoalbum.service;

import com.photoalbum.model.Comment;
import com.photoalbum.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }
    
    public List<Comment> getPhotoComments(Long photoId) {
        return commentRepository.findByPhotoId(photoId);
    }
}