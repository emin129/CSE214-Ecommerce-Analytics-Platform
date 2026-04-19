package com.ecommerce.ecommerce_backen.repository;

import com.ecommerce.ecommerce_backen.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = "SELECT r FROM Review r JOIN FETCH r.user WHERE r.product.id = :productId",
           countQuery = "SELECT count(r) FROM Review r WHERE r.product.id = :productId")
    Page<Review> findByProductId(@Param("productId") Long productId, Pageable pageable);

    @Query("SELECT r FROM Review r JOIN FETCH r.user WHERE r.product.store.owner.id = :sellerId")
    List<Review> findAllReviewsBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT r FROM Review r JOIN FETCH r.user WHERE r.product.store.owner.username = :username")
    List<Review> findAllByProduct_Store_Owner_Username(@Param("username") String username);

    @Query("SELECT AVG(r.starRating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query(value = "SELECT r FROM Review r JOIN FETCH r.user", 
           countQuery = "SELECT count(r) FROM Review r")
    Page<Review> findAll(Pageable pageable);
}