package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.dto.ReviewDTO;
import com.ecommerce.ecommerce_backen.entity.Review;
import com.ecommerce.ecommerce_backen.repository.ReviewRepository;
import com.ecommerce.ecommerce_backen.repository.OrderRepository;
import com.ecommerce.ecommerce_backen.service.ReviewService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public ReviewDTO addReview(Review review) {
        boolean isDelivered = orderRepository.existsByUserIdAndProductIdAndStatus(
                review.getUser().getId(), 
                review.getProduct().getId()
        );
        if (!isDelivered) {
            throw new RuntimeException("You can only review products that have been delivered to you.");
        }
        review.setReviewDate(LocalDateTime.now());
        if (review.getSentiment() == null) {
            review.setSentiment("NEUTRAL");
        }
        Review savedReview = reviewRepository.save(review);
        return convertToDTO(savedReview);
    }

    @Override
    @Transactional
    public ReviewDTO addSellerReply(Long reviewId, String replyText) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setSellerReply(replyText);
        review.setReviewAnswerTimestamp(LocalDateTime.now());
        Review updatedReview = reviewRepository.save(review);
        return convertToDTO(updatedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDTO> getReviewsByProduct(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getSellerProductReviews(Long sellerId) {
        return reviewRepository.findAllReviewsBySellerId(sellerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getAllReviewsForSeller(String username) {
        return reviewRepository.findAllByProduct_Store_Owner_Username(username)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDTO> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public void deleteReview(Long id, String requesterUsername) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        try {
            String ownerUsername = review.getProduct().getStore().getOwner().getUsername();
            if (!ownerUsername.equals(requesterUsername)) {
                throw new AccessDeniedException("You are not authorized to delete this review!");
            }
        } catch (EntityNotFoundException e) {
            // Eğer ürün/mağaza silinmişse ama yorum duruyorsa, sadece admin silebilir moduna sokabiliriz
            // Ya da bu durumda silmeye izin ver:
        }
        reviewRepository.delete(review);
    }

    @Override
    @Transactional
    public void deleteReviewByAdmin(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        reviewRepository.delete(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateAverageRating(Long productId) {
        Double avg = reviewRepository.getAverageRatingByProductId(productId);
        return (avg != null) ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    private ReviewDTO convertToDTO(Review review) {
        // Kullanıcı adı belirleme
        String displayUsername = "Anonymous User";
        if (review.getUser() != null) {
            if (review.getUser().getUsername() != null && !review.getUser().getUsername().isEmpty()) {
                displayUsername = review.getUser().getUsername();
            } else if (review.getUser().getEmail() != null) {
                displayUsername = review.getUser().getEmail();
            }
        }

        // Ürün bilgilerini güvenli çekme (EntityNotFoundException koruması)
        String pName = "Unknown Product";
        Long pId = null;
        try {
            if (review.getProduct() != null) {
                pName = review.getProduct().getName();
                pId = review.getProduct().getId();
            }
        } catch (EntityNotFoundException e) {
            pName = "Deleted Product";
        }

        return ReviewDTO.builder()
                .id(review.getId())
                .starRating(review.getStarRating())
                .reviewText(review.getReviewText())
                .sentiment(review.getSentiment() != null ? review.getSentiment().toUpperCase() : "NEUTRAL")
                .reviewDate(review.getReviewDate())
                .sellerReply(review.getSellerReply())
                .reviewAnswerTimestamp(review.getReviewAnswerTimestamp())
                .productId(pId)
                .productName(pName)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .username(displayUsername)
                .build();
    }
}