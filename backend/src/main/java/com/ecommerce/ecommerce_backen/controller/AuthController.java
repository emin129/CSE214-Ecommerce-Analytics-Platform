package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.dto.LoginRequest;
import com.ecommerce.ecommerce_backen.dto.RegisterRequest;
import com.ecommerce.ecommerce_backen.entity.User;
import com.ecommerce.ecommerce_backen.security.JwtTokenProvider;
import com.ecommerce.ecommerce_backen.service.UserService;
import com.ecommerce.ecommerce_backen.entity.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Bunu ekle
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(request.getPassword()); 
        newUser.setEmail(request.getEmail());
        newUser.setRole(Role.USER);
        newUser.setBanned(false); 

        userService.saveUser(newUser);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.findByUsername(request.getUsername())
                .map(user -> {
                    if (user.isBanned()) {
                        return ResponseEntity.status(403).body(Map.of("error", "Your account has been banned."));
                    }

                    // DOĞRU KARŞILAŞTIRMA BURASI:
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole().name());

                        Map<String, Object> response = new HashMap<>();
                        response.put("token", token);
                        response.put("role", user.getRole().name());

                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("username", user.getUsername());
                        userMap.put("email", user.getEmail());
                        userMap.put("role", user.getRole().name());

                        response.put("user", userMap);
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid username or password")));
    }
}