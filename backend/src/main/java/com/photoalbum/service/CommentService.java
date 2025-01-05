package com.photoalbum.service;

import com.photoalbum.model.Album;
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
    public static boolean isCommentAllowed(Album album) {
        return album.isAllowComments(); // 判断是否允许评论
    }
    
    public Comment addComment(Comment comment) {

        return commentRepository.save(comment);
    }
    
    public List<Comment> getPhotoComments(Long photoId) {
        return commentRepository.findByPhotoId(photoId);
    }

    public Comment getComment(Long commentId) {
        return commentRepository.findById(commentId).orElse(null);
    }
}