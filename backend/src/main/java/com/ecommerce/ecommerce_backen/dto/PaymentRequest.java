package com.ecommerce.ecommerce_backen.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private long amount; 
    private String currency; 
}