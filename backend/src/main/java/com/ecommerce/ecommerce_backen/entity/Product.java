package com.ecommerce.ecommerce_backen.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data; 
import java.util.List;

@Entity
@Data 
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description; 

    @Column(name = "unit_price")
    @JsonProperty("price") 
    private Double unitPrice;

    private Integer stock;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl; 

    @Column(name = "is_active")
    private boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "store_id") 
    @JsonBackReference
    private Store store;

    @ManyToOne
    @JoinColumn(name = "category_id") 
    private Category category;
}