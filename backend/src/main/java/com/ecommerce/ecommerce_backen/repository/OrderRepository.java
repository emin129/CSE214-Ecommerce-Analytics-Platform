package com.ecommerce.ecommerce_backen.repository;

import com.ecommerce.ecommerce_backen.entity.Order;
import com.ecommerce.ecommerce_backen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi WHERE oi.product.store.owner = :seller")
    List<Order> findOrdersBySeller(@Param("seller") User seller);

    List<Order> findByUserId(Long userId);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.orderItems oi " +
           "WHERE o.user.id = :userId " +
           "AND oi.product.id = :productId " +
           "AND (o.status = 'DELIVERED' OR o.status = 'delivered')")
    boolean existsByUserIdAndProductIdAndStatus(
            @Param("userId") Long userId, 
            @Param("productId") Long productId);
}