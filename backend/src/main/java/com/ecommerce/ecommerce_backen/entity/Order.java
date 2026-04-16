package com.ecommerce.ecommerce_backen.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; 

    @Column(name = "order_id", unique = true) 
    private String orderId;

    @Column(name = "status")
    private String status;

    @Column(name = "order_purchase_timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime orderDate;

    @Column(name = "grand_total")
    private Double totalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") 
    @JsonIgnoreProperties({"reviews", "password", "orders", "handler", "hibernateLazyInitializer"}) 
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @JsonProperty("items") 
    private List<OrderItem> orderItems;

    public Double getTotalAmount() {
        return this.totalPrice;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalPrice = totalAmount;
    }
}