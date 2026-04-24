package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        boolean updated = orderService.updateOrderStatus(orderId, newStatus);
        
        if (updated) {
            return ResponseEntity.ok("Status updated.");
        } else {
            return ResponseEntity.badRequest().body("Invalid order ID or status.");
        }
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<String> adminRefundOrder(@PathVariable Long id) {
        try {
            orderService.refundOrder(id);
            return ResponseEntity.ok("Order refunded by admin.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Refund failed: " + e.getMessage());
        }
    }
}