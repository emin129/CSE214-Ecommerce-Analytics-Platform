package com.ecommerce.ecommerce_backen.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_reviews") 
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "star_rating")
    private int starRating;

    @Column(name = "sentiment")
    private String sentiment; 

    @Column(name = "review_answer_timestamp")
    private LocalDateTime reviewAnswerTimestamp;

    @Column(name = "comment_message", columnDefinition = "TEXT") 
    private String reviewText;

    @Column(name = "review_creation_date") 
    private LocalDateTime reviewDate;

    @Column(name = "seller_reply", columnDefinition = "TEXT")
    private String sellerReply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}