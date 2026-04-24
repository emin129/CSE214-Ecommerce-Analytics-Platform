package com.ecommerce.ecommerce_backen.dto;

import lombok.Data;

@Data
public class ProductDto {
    private Long id; 
    private String productId; 
    private String name;
    private String description;
    private double price;
    private int stock;
    private String imageUrl;
    private Long categoryId; 
    private Long sellerId; 
}