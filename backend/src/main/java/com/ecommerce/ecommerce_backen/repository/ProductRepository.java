package com.ecommerce.ecommerce_backen.repository;

import com.ecommerce.ecommerce_backen.entity.Product;
import com.ecommerce.ecommerce_backen.entity.User;
import com.ecommerce.ecommerce_backen.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.category c
        JOIN p.store s
        WHERE p.isActive = true
        AND s.status = 'open'
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:categoryId IS NULL OR c.id = :categoryId)
    """)
    Page<Product> searchProducts(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    @Query(value = """
        SELECT p FROM Product p
        LEFT JOIN FETCH p.category
        JOIN p.store s
        WHERE p.store.owner = :seller 
        AND p.isActive = true
        AND s.status = 'open'
    """,
    countQuery = """
        SELECT count(p) FROM Product p
        JOIN p.store s
        WHERE p.store.owner = :seller 
        AND p.isActive = true
        AND s.status = 'open'
    """)
    Page<Product> findBySeller(@Param("seller") User seller, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.store s WHERE p.store = :store AND s.status = 'open' AND p.isActive = true")
    Page<Product> findByStore(@Param("store") Store store, Pageable pageable);
}