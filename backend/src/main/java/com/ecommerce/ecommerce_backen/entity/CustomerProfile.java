package com.ecommerce.ecommerce_backen.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "customer_profiles")
@Data
public class CustomerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", insertable = false, updatable = false) 
    private Integer userId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user; 

    private String city;
    private String state;

    @Column(name = "zip_code_prefix")
    private String zipCodePrefix;

    @Column(name = "membership_type")
    private String membershipType;

    @JsonIgnore
    private Integer age;

    @JsonIgnore
    private Double lat;

    @JsonIgnore
    private Double lng;
}