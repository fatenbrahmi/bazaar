package com.shop.bazaar.auth.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JWTTokenHelper {
    
    @Value("${jwt.auth.app}")
    private String appName;

    @Value("${jwt.auth.secret_key}")
    private String secretKey;

    @Value("${jwt.auth.expires_in}")
    private String expiresInString; // Changé en String pour le parsing

    private int expiresIn; // Stocke la valeur convertie

    @PostConstruct
    public void init() {
        try {
            // Nettoie la valeur en prenant seulement la partie numérique avant tout caractère non numérique
            String numericPart = expiresInString.split("[^0-9]")[0];
            this.expiresIn = Integer.parseInt(numericPart);
            
            if (this.expiresIn <= 0) {
                throw new IllegalArgumentException("L'expiration du token doit être positive");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Configuration JWT invalide. 'jwt.auth.expires_in' doit être un nombre valide", e);
        }
    }

    public String generateToken(String userName) {
        return Jwts.builder()
                .issuer(appName)
                .subject(userName)
                .issuedAt(new Date())
                .expiration(generateExpirationDate())
                .signWith(getSigningKey())
                .compact();
    }

    private SecretKey getSigningKey() {
        byte[] keysBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keysBytes);
    }

    private Date generateExpirationDate() {
        return new Date(new Date().getTime() + expiresIn * 1000L);
    }

    public String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUserNameFromToken(token);
        return (username != null &&
                username.equals(userDetails.getUsername()) &&
                !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        Date expireDate = getExpirationDate(token);
        return expireDate != null && expireDate.before(new Date());
    }

    private Date getExpirationDate(String token) {
        try {
            final Claims claims = getAllClaimsFromToken(token);
            return claims.getExpiration();
        } catch (Exception e) {
            return null;
        }
    }

    public String getUserNameFromToken(String authToken) {
        try {
            final Claims claims = getAllClaimsFromToken(authToken);
            return claims.getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}