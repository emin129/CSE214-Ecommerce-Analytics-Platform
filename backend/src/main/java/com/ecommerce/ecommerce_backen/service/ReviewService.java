package com.ecommerce.ecommerce_backen.service;

import com.ecommerce.ecommerce_backen.dto.ReviewDTO;
import com.ecommerce.ecommerce_backen.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ReviewService {
    ReviewDTO addReview(Review review);
    ReviewDTO addSellerReply(Long reviewId, String replyText);
    Page<ReviewDTO> getReviewsByProduct(Long productId, Pageable pageable);
    List<ReviewDTO> getSellerProductReviews(Long sellerId);
    List<ReviewDTO> getAllReviewsForSeller(String email);
    Page<ReviewDTO> getAllReviews(Pageable pageable);
    void deleteReview(Long id, String requesterEmail);
    void deleteReviewByAdmin(Long id);
    Double calculateAverageRating(Long productId);
}