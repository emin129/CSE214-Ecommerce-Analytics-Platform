package com.ecommerce.ecommerce_backen.service;

import com.ecommerce.ecommerce_backen.dto.OrderRequest;
import com.ecommerce.ecommerce_backen.entity.Order;
import com.ecommerce.ecommerce_backen.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;
import java.util.Optional;

public interface OrderService {

    
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Long id);
    Order saveOrder(Order order);
    void deleteOrder(Long id);
    boolean updateOrderStatus(Long orderId, String newStatus);
    void refundOrder(Long orderId);
    void updateShipmentStatus(Long orderId, String status);
    void createOrder(OrderRequest orderRequest);
    List<Order> getOrdersBySeller(User seller);
    List<Order> getOrdersByUserId(Long userId);
    boolean cancelAndDeleteOrder(Long id);
    Page<Order> getAllOrders(Pageable pageable);
    boolean canUserReview(Long userId, Long productId);
    




}

