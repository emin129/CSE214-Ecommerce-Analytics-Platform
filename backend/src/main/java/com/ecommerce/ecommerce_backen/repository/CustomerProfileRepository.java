package com.ecommerce.ecommerce_backen.repository;

import com.ecommerce.ecommerce_backen.dto.CustomerDetailsDTO;
import com.ecommerce.ecommerce_backen.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Integer> {

    @Query("SELECT new com.ecommerce.ecommerce_backen.dto.CustomerDetailsDTO(" +
           "c.id, " +
           "c.user.id, " +
           "c.user.username, " +
           "COALESCE(c.city, (SELECT s.city FROM Store s WHERE s.owner.id = c.user.id)), " +
           "c.state, " +
           "c.zipCodePrefix, " +
           "c.membershipType) " +
           "FROM CustomerProfile c " +
           "WHERE (:searchTerm IS NULL OR LOWER(c.user.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<CustomerDetailsDTO> findProfilesWithSearch(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT new com.ecommerce.ecommerce_backen.dto.CustomerDetailsDTO(" +
           "c.id, " +
           "c.user.id, " +
           "c.user.username, " +
           "COALESCE(c.city, (SELECT s.city FROM Store s WHERE s.owner.id = c.user.id)), " +
           "c.state, " +
           "c.zipCodePrefix, " +
           "CASE " +
           "  WHEN SUM(oi.price * oi.quantity) >= 300 THEN 'GOLD' " +
           "  WHEN SUM(oi.price * oi.quantity) >= 100 THEN 'SILVER' " +
           "  ELSE 'BRONZE' " +
           "END) " +
           "FROM CustomerProfile c " +
           "JOIN Order o ON o.user.id = c.user.id " +
           "JOIN OrderItem oi ON oi.order.id = o.id " +
           "JOIN Product p ON p.id = oi.product.id " +
           "WHERE p.store.owner.id = :sellerId " +
           "AND (:searchTerm IS NULL OR LOWER(c.user.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "GROUP BY c.id, c.user.id, c.user.username, c.city, c.state, c.zipCodePrefix")
    Page<CustomerDetailsDTO> findCustomersBySeller(@Param("sellerId") Long sellerId, @Param("searchTerm") String searchTerm, Pageable pageable);
}