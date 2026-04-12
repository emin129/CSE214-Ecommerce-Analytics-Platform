import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ReviewService } from '../../../review.service';
import { ReviewDTO } from '../../../ReviewDTO';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  reviews: ReviewDTO[] = [];
  avgRating: number = 0;
  isLoading = true;
  isSubmitting = false;
  newRating = 0;
  newComment = '';
  hasReviewed = false;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    public router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.currentUserId = this.authService.getUserId();
    }
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.resetComponentState();
        this.fetchProductData(id);
      } else {
        this.router.navigate(['/user/products']);
      }
    });
  }

  private resetComponentState(): void {
    this.product = null;
    this.reviews = [];
    this.avgRating = 0;
    this.newRating = 0;
    this.newComment = '';
    this.hasReviewed = false;
  }

  fetchProductData(id: number): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loadReviewData(id);
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/user/products']);
        this.isLoading = false;
      }
    });
  }

  loadReviewData(productId: number): void {
    this.reviewService.getAverageRating(productId).subscribe(rating => {
      this.avgRating = rating;
    });

    this.reviewService.getProductReviews(productId, 0, 100).subscribe(data => {
      this.reviews = data.content || [];
      if (this.currentUserId) {
        this.hasReviewed = this.reviews.some(r => r.userId === this.currentUserId);
      }
    });
  }

  addToCart() {
    if (this.product && (this.product.stock > 0 || this.product.stock === null)) {
      this.cartService.addToCart(this.product);
      if (confirm(`${this.product.name} added to cart. Go to cart?`)) {
        this.router.navigate(['/user/cart']);
      }
    } else {
      alert('This product is currently out of stock.');
    }
  }

  setRating(rating: number) {
    this.newRating = rating;
  }

  submitReview() {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to submit a review.');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.newRating === 0 || !this.newComment.trim()) {
      alert('Please provide both a rating and a comment.');
      return;
    }

    this.isSubmitting = true;

    const reviewPayload = {
      starRating: this.newRating,
      reviewText: this.newComment,
      sentiment: 'PENDING',
      product: { id: this.product.id },
      user: { id: this.currentUserId }
    };

    this.reviewService.postReview(reviewPayload).subscribe({
      next: () => {
        alert('Thank you! Your feedback has been posted.');

        // Listeyi anlık güncellemek için mock bir nesne ekliyoruz
        const newReviewForList: ReviewDTO = {
          starRating: this.newRating,
          reviewText: this.newComment,
          productId: this.product.id,
          userId: this.currentUserId!,
          sentiment: 'PENDING',
          username: 'You',
          reviewDate: new Date()
        };

        this.reviews = [newReviewForList, ...this.reviews];
        this.hasReviewed = true;
        this.newRating = 0;
        this.newComment = '';
        this.isSubmitting = false;

        this.reviewService.getAverageRating(this.product.id).subscribe(r => this.avgRating = r);
      },
      error: (err) => {
        this.isSubmitting = false;
        const errorMsg = typeof err.error === 'string' ? err.error : 'Could not post review.';
        alert(errorMsg);
      }
    });
  }

  triggerReturn() { alert('Your return request has been logged.'); }
  contactSecurity() { alert('SSL Secured Transaction Active.'); }
  checkFastDelivery() { alert('Express delivery available for your address.'); }
}
