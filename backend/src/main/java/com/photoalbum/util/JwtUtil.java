package com.photoalbum.util;

import com.photoalbum.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey; // 从配置中加载密钥

    @Value("${jwt.expiration}") // JWT 过期时间
    private long expirationTime;

    // 生成JWT令牌
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("createdAt", user.getCreatedAt().toString());
        return Jwts.builder()
                .setClaims(claims) // 添加用户信息到 JWT 的 Payload
                .setSubject(String.valueOf(user.getId())) // 设置用户 ID 为 Subject
                .setIssuedAt(new Date()) // 签发时间
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // 过期时间
                .signWith(SignatureAlgorithm.HS256, secretKey) // 使用 HMAC SHA-256 算法签名
                .compact();
    }

    // 验证JWT令牌
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 提取用户信息
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    // 从JWT令牌中提取用户ID
    public Long extractUserId(String token) {
        return Long.parseLong(extractAllClaims(token).get("id").toString());
    }

    // 从JWT令牌中提取用户名
    public String extractUsername(String token) {
        return extractAllClaims(token).get("username").toString();
    }

    // 从JWT令牌中提取用户角色
    public String extractRole(String token) {
        return extractAllClaims(token).get("role").toString();
    }

    // 从JWT令牌中提取用户创建时间
    public String extractCreatedAt(String token) {
        return extractAllClaims(token).get("createdAt").toString();
    }
}
