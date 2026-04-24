package com.ecommerce.ecommerce_backen.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private Long orderId;
    private int quantity;
}
