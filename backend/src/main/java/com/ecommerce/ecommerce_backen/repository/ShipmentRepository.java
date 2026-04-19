package com.ecommerce.ecommerce_backen.repository;

import com.ecommerce.ecommerce_backen.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    
}