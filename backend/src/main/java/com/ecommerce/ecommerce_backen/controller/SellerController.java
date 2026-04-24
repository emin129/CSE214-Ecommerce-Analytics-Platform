package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.dto.CustomerDetailsDTO;
import com.ecommerce.ecommerce_backen.entity.Order;
import com.ecommerce.ecommerce_backen.entity.Product;
import com.ecommerce.ecommerce_backen.entity.Store;
import com.ecommerce.ecommerce_backen.entity.User;
import com.ecommerce.ecommerce_backen.repository.UserRepository;
import com.ecommerce.ecommerce_backen.repository.StoreRepository;
import com.ecommerce.ecommerce_backen.service.OrderService;
import com.ecommerce.ecommerce_backen.service.ProductService;
import com.ecommerce.ecommerce_backen.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'SELLER', 'ROLE_ADMIN', 'ADMIN')")
@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "http://localhost:4200")
public class SellerController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getSellerProducts(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Store store = storeRepository.findAll().stream()
                .filter(s -> s.getOwner().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Store not found for this seller"));

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsByStore(store, pageable));
    }

    @GetMapping("/my-customers")
    public ResponseEntity<Page<CustomerDetailsDTO>> getMyCustomers(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(customerService.getCustomersBySeller(user.getId(), search, pageable));
    }

    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Store store = storeRepository.findAll().stream()
                .filter(s -> s.getOwner().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Store not found"));

        product.setStore(store);
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Store store = storeRepository.findAll().stream()
                .filter(s -> s.getOwner().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Store not found"));

        updatedProduct.setStore(store);
        return ResponseEntity.ok(productService.updateProduct(id, updatedProduct));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(product);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getSellerOrders(Authentication authentication) {
        String username = authentication.getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return ResponseEntity.ok(orderService.getOrdersBySeller(seller));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        List<String> allowedStatuses = List.of("PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED","IN_TRANSIT");
        String cleanStatus = status.replace("\"", "").toUpperCase(); 
        if (!allowedStatuses.contains(cleanStatus)) {
            return ResponseEntity.badRequest().body("Invalid status.");
        }
        orderService.updateShipmentStatus(id, cleanStatus);
        return ResponseEntity.ok("Status updated.");
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
        boolean cancelled = orderService.cancelAndDeleteOrder(id);
        if (cancelled) {
            return ResponseEntity.ok("Order cancelled and deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Order not found or could not be cancelled.");
        }
    }
}