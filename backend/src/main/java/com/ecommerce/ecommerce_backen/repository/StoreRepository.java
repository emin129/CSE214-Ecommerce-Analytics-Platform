package com.ecommerce.ecommerce_backen.repository;

import com.ecommerce.ecommerce_backen.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    
    Optional<Store> findByName(String name);

    @Query(value = """
            SELECT 
                p.id as productId, 
                s.id as storeId, 
                p.unit_price as unitPrice, 
                s.name as storeName, 
                s.city as storeCity, 
                p.name as productName, 
                s.status as storeStatus, 
                u.username as ownerUsername, 
                u.email as ownerEmail 
            FROM products p 
            JOIN stores s ON p.store_id = s.id 
            JOIN users u ON s.owner_id = u.id 
            WHERE u.username LIKE %:ownerName%
            """, 
            countQuery = """
            SELECT count(*) 
            FROM products p 
            JOIN stores s ON p.store_id = s.id 
            JOIN users u ON s.owner_id = u.id 
            WHERE u.username LIKE %:ownerName%
            """,
            nativeQuery = true)
    Page<Object[]> searchStoreJoinDataByOwnerPaged(@Param("ownerName") String ownerName, Pageable pageable);
}