package com.ecommerce.ecommerce_backen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Long id;
    private int starRating;
    private String reviewText; 
    private String sentiment;
    private LocalDateTime reviewDate;
    private String sellerReply; 
    private LocalDateTime reviewAnswerTimestamp; 
    private Long productId;
    private String productName;
    private Long userId;
    private String username;
}