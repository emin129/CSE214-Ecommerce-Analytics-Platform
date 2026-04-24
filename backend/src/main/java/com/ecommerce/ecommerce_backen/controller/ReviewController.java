package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.dto.ReviewDTO;
import com.ecommerce.ecommerce_backen.entity.Review;
import com.ecommerce.ecommerce_backen.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Hem Admin hem Satıcı cevap yazabilsin
    @PostMapping("/admin/{reviewId}/reply")
    @PreAuthorize("hasAnyAuthority('SELLER', 'ROLE_SELLER', 'ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<ReviewDTO> replyToReview(@PathVariable Long reviewId, @RequestBody String replyText) {
        String cleanedReply = replyText.startsWith("\"") && replyText.endsWith("\"") 
                ? replyText.substring(1, replyText.length() - 1) : replyText;
        return ResponseEntity.ok(reviewService.addSellerReply(reviewId, cleanedReply));
    }

    // Ürün yorumlarını herkes görebilir (Giriş zorunlu değil)
    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewDTO>> getProductReviews(@PathVariable Long productId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId, pageable));
    }

    // Sadece kayıtlı kullanıcılar yorum yapabilir
    @PostMapping
    @PreAuthorize("hasAnyAuthority('USER', 'ROLE_USER')")
    public ResponseEntity<ReviewDTO> postReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    // Satıcının kendi ürünlerine gelen yorumları listelemesi (Senin hata aldığın yer burasıydı)
    @GetMapping("/seller")
    @PreAuthorize("hasAnyAuthority('SELLER', 'ROLE_SELLER')")
    public ResponseEntity<List<ReviewDTO>> getSellerReviews(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(reviewService.getAllReviewsForSeller(principal.getName()));
    }

    // Admin tüm yorumları yönetebilir
    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<Page<ReviewDTO>> getAllReviewsForAdmin(Pageable pageable) {
        return ResponseEntity.ok(reviewService.getAllReviews(pageable));
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<Page<ReviewDTO>> searchReviewsByProduct(@RequestParam Long productId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId, pageable));
  }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<Void> adminRemoveReview(@PathVariable Long id) {
        reviewService.deleteReviewByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.calculateAverageRating(productId));
    }
}