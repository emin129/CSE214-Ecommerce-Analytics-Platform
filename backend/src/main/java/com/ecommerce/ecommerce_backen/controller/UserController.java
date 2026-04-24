package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.entity.User;
import com.ecommerce.ecommerce_backen.service.UserService;
import com.ecommerce.ecommerce_backen.dto.SellerUpgradeRequest; // Bu DTO'yu aşağıda vereceğim
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/search")
    public Page<User> searchUsers(
            @RequestParam(defaultValue = "") String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchUsers(username, pageable);
    }

    @PostMapping("/become-seller")
    public ResponseEntity<String> becomeSeller(
            @RequestBody SellerUpgradeRequest request, 
            Authentication authentication) {
        
        String username = authentication.getName();
        userService.upgradeToSeller(username, request);
        
        return ResponseEntity.ok("User upgraded to seller and store created successfully.");
    }
}