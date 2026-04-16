package com.ecommerce.ecommerce_backen.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey jwtSecret = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long jwtExpirationMs = 86400000; 

  public String generateToken(String username, String role) {
    // Eğer gelen rolde zaten ROLE_ varsa olduğu gibi bırak, yoksa ekle
    String safeRole = role.toUpperCase().replace("İ", "I");
    if (!safeRole.startsWith("ROLE_")) {
        safeRole = "ROLE_" + safeRole;
    }

    return Jwts.builder()
            .setSubject(username)
            .claim("role", safeRole) // Artık içeride tek bir ROLE_ olacak
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(jwtSecret)  
            .compact();
  }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}