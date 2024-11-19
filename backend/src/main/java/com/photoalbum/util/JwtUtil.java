package com.photoalbum.util;

import com.photoalbum.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey; // 从配置中加载密钥

    @Value("${jwt.expiration}") // JWT 过期时间
    private long expirationTime;

    // 生成JWT令牌
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
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

    // 获取用户ID从JWT令牌
    public Long extractUserId(String token) {
        return Long.parseLong(Jwts.parser()
                .setSigningKey(secretKey).
                parseClaimsJws(token).
                getBody().
                getSubject());
    }
}
