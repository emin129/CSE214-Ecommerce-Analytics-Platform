package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.entity.User;
import com.ecommerce.ecommerce_backen.entity.Role;
import com.ecommerce.ecommerce_backen.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; // Bunu ekledik
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private UserService userService;

    // 99k Kullanıcıyı hem sayfa sayfa hem de EN YENİDEN EN ESKİYE getiriyoruz
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Sort.by("id").descending() -> En büyük ID'li (en son kaydolan) kullanıcı 1. sıraya gelir
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (role == null) {
            return ResponseEntity.badRequest().body("Missing role field");
        }
        userService.updateUserRole(id, Role.valueOf(role.toUpperCase()));
        return ResponseEntity.ok("Role updated successfully");
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id) {
        userService.banUser(id);
        return ResponseEntity.ok("User banned");
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long id) {
        userService.unbanUser(id);
        return ResponseEntity.ok("User unbanned");
    }
}