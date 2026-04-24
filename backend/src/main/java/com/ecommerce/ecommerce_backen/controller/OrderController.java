package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.dto.OrderRequest;
import com.ecommerce.ecommerce_backen.entity.Order;
import com.ecommerce.ecommerce_backen.service.OrderService;
import com.ecommerce.ecommerce_backen.repository.UserRepository;
import com.ecommerce.ecommerce_backen.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_SELLER', 'SELLER')")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam String newStatus) {
        boolean updated = orderService.updateOrderStatus(id, newStatus);
        if (updated) {
            return ResponseEntity.ok("Order status updated to " + newStatus);
        } else {
            return ResponseEntity.badRequest().body("Order not found.");
        }
    }

    @GetMapping("/check-eligibility")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'USER')")
    public ResponseEntity<Boolean> checkReviewEligibility(@RequestParam Long userId, @RequestParam Long productId) {
       boolean canReview = orderService.canUserReview(userId, productId);
       return ResponseEntity.ok(canReview);
    }
    
    @GetMapping("/seller")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'SELLER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<List<Order>> getSellerOrders(Principal principal) {
        User seller = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return ResponseEntity.ok(orderService.getOrdersBySeller(seller));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_USER', 'USER')")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'USER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            orderService.createOrder(orderRequest);
            return ResponseEntity.ok("Order created successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create order: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'USER', 'ROLE_ADMIN', 'ADMIN')")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @PutMapping({"/seller/{id}/cancel", "/{id}/cancel"})
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'USER', 'ROLE_ADMIN', 'ADMIN', 'ROLE_SELLER', 'SELLER')")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
        boolean cancelled = orderService.cancelAndDeleteOrder(id);
        if (cancelled) {
            return ResponseEntity.ok("Order cancelled and deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Order not found or could not be cancelled.");
        }
    }
}