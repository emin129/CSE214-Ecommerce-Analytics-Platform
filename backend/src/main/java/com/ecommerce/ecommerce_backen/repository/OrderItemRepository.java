package com.ecommerce.ecommerce_backen.repository;

import com.ecommerce.ecommerce_backen.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.store.owner.id = :sellerId")
    List<OrderItem> findBySellerId(@Param("sellerId") Long sellerId);
}