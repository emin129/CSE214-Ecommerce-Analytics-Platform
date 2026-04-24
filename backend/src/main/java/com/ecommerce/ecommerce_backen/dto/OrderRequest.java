package com.ecommerce.ecommerce_backen.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private String status;
    private List<OrderItemRequest> items;
}

