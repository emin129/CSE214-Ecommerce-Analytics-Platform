package com.ecommerce.ecommerce_backen.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CustomerDetailsDTO {
    private Integer id;
    private Long userId;
    private String username;
    private String city;
    private String state;
    private String zipCodePrefix;
    private String membershipType;

    
    public CustomerDetailsDTO(Integer id, Long userId, String username, String city, 
                              String state, String zipCodePrefix, String membershipType) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.city = city;
        this.state = state;
        this.zipCodePrefix = zipCodePrefix;
        this.membershipType = membershipType;
    }
}