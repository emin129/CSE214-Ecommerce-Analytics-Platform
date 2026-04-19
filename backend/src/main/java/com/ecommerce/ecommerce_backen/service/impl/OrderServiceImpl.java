package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.dto.OrderItemRequest;
import com.ecommerce.ecommerce_backen.dto.OrderRequest;
import com.ecommerce.ecommerce_backen.entity.*;
import com.ecommerce.ecommerce_backen.repository.*;
import com.ecommerce.ecommerce_backen.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void createOrder(OrderRequest orderRequest) {
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(orderRequest.getStatus());
        order.setOrderId(UUID.randomUUID().toString());

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            int requestedQty = itemRequest.getQuantity();
            if (requestedQty > product.getStock()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            double itemTotal = product.getUnitPrice() * requestedQty;
            total += itemTotal;

            product.setStock(product.getStock() - requestedQty);
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(requestedQty);
            item.setOrder(order);
            orderItems.add(item);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);
        orderRepository.save(order);
    }

    @Override
    public boolean updateOrderStatus(Long orderId, String newStatus) {
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(newStatus);
            orderRepository.save(order);
            return true;
        }).orElse(false);
    }

    @Override
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public void refundOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        User user = order.getUser();
        user.setBalance(user.getBalance() + order.getTotalAmount());
        userRepository.save(user);

        order.setStatus("REFUNDED");
        orderRepository.save(order);
    }

    @Override
    public void updateShipmentStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersBySeller(User seller) {
        return orderRepository.findOrdersBySeller(seller);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public boolean cancelAndDeleteOrder(Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product != null) {
                    product.setStock(product.getStock() + item.getQuantity());
                    productRepository.save(product);
                }
            }
            
            User user = order.getUser();
            if (user != null) {
                user.setBalance(user.getBalance() + order.getTotalAmount());
                userRepository.save(user);
            }

            order.getOrderItems().clear();
            orderRepository.save(order);
            orderRepository.delete(order);
            return true;
        }
        return false;
    }

    @Override
    public boolean canUserReview(Long userId, Long productId) {
      return orderRepository.existsByUserIdAndProductIdAndStatus(userId, productId);
    }
}