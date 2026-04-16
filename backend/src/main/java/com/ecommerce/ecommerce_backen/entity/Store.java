package com.ecommerce.ecommerce_backen.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "stores")
@Data
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String city; 

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "status", nullable = false)
    private String status = "open";
}