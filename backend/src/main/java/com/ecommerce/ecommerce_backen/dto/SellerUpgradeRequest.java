package com.ecommerce.ecommerce_backen.dto;

import lombok.Data;

@Data
public class SellerUpgradeRequest {
    private String storeName;
    private String city;
    private String description;
}