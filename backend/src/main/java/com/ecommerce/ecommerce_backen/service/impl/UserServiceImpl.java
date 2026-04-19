package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.entity.Role;
import com.ecommerce.ecommerce_backen.entity.User;
import com.ecommerce.ecommerce_backen.entity.Store;
import com.ecommerce.ecommerce_backen.entity.CustomerProfile;
import com.ecommerce.ecommerce_backen.repository.UserRepository;
import com.ecommerce.ecommerce_backen.repository.StoreRepository;
import com.ecommerce.ecommerce_backen.repository.CustomerProfileRepository;
import com.ecommerce.ecommerce_backen.service.UserService;
import com.ecommerce.ecommerce_backen.dto.SellerUpgradeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private CustomerProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        if (user.getState() == null) {
            user.setState("ACTIVE");
        }
        
        User savedUser = userRepository.save(user);

        CustomerProfile profile = new CustomerProfile();
        profile.setUser(savedUser);
        profile.setMembershipType("bronze");
        profileRepository.save(profile);

        return savedUser;
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    @Override
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void updateUserRole(Long id, Role role) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    public void banUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(true);
        userRepository.save(user);
    }

    @Override
    public void unbanUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(false);
        userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public Page<User> searchUsers(String username, Pageable pageable) {
       return userRepository.findByUsernameContainingIgnoreCase(username, pageable);
    }

    @Override
    @Transactional
    public void upgradeToSeller(String username, SellerUpgradeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.SELLER);
        userRepository.save(user);

        Store store = new Store();
        store.setName(request.getStoreName());
        store.setCity(request.getCity());
        store.setOwner(user);
        storeRepository.save(store);
    }
}