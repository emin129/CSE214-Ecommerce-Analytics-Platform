package com.ecommerce.ecommerce_backen.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shipments")
@Data
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String warehouseBlock;

    private String modeOfShipment;

    private String status;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
}