package com.ecommerce.ecommerce_backen.service;

import com.ecommerce.ecommerce_backen.entity.Role;
import com.ecommerce.ecommerce_backen.entity.User;
import com.ecommerce.ecommerce_backen.dto.SellerUpgradeRequest;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 

import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    User saveUser(User user);
    boolean existsByUsername(String username);
    Page<User> getAllUsers(Pageable pageable); 
    void deleteUserById(Long id);
    void updateUserRole(Long id, Role role);
    void banUser(Long id);
    void unbanUser(Long id);
    User getUserById(Long id);
    Page<User> searchUsers(String username, Pageable pageable);
    void upgradeToSeller(String username, SellerUpgradeRequest request);
}