import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../review.service';
import { ReviewDTO } from '../../../ReviewDTO';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  standalone: false
})
export class ReviewComponent implements OnInit {
  reviews: ReviewDTO[] = [];
  isLoading = true;
  currentPage = 0;
  pageSize = 50;
  totalElements = 0;
  totalPages = 0;
  jumpPage: number = 1;
  searchProductId: number | null = null;
  activeReviewId: number | null = null;
  adminReplyText: string = '';
  isSubmitting = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.isLoading = true;
    let request;

    if (this.searchProductId !== null && this.searchProductId !== undefined) {
      request = this.reviewService.searchReviewsByProduct(
        this.searchProductId,
        this.currentPage,
        this.pageSize
      );
    } else {
      request = this.reviewService.getAllReviewsForAdmin(
        this.currentPage,
        this.pageSize
      );
    }

    request.subscribe({
      next: (data: any) => {
        this.reviews = data.content || [];
        this.totalPages = data.totalPages || 0;
        this.totalElements = data.totalElements || 0;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error("Fetch error:", err);
        this.isLoading = false;
      }
    });
  }

  submitAdminReply(reviewId: number): void {
    if (!this.adminReplyText.trim()) return;
    this.isSubmitting = true;

    this.reviewService.postReviewReply(reviewId, this.adminReplyText).subscribe({
      next: () => {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.sellerReply = this.adminReplyText;
        }
        this.activeReviewId = null;
        this.adminReplyText = '';
        this.isSubmitting = false;
      },
      error: (err:any) => {
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }

  changePage(step: number): void {
    const nextStep = this.currentPage + step;
    if (nextStep >= 0 && nextStep < this.totalPages) {
      this.currentPage = nextStep;
      this.fetchReviews();
    }
  }

  goToPage(): void {
    if (this.jumpPage >= 1 && this.jumpPage <= this.totalPages) {
      this.currentPage = this.jumpPage - 1;
      this.fetchReviews();
    } else {
      alert(`Invalid page! Range: 1 - ${this.totalPages}`);
    }
  }

  deleteReview(id: number): void {
    if (confirm('Are you sure you want to delete this log?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => this.reviews = this.reviews.filter(r => r.id !== id),
        error: (err) => console.error(err)
      });
    }
  }

  searchByProduct(): void {
    if (this.searchProductId !== null && this.searchProductId > 0) {
      this.currentPage = 0;
      this.fetchReviews();
    }
  }

  clearSearch(): void {
    this.searchProductId = null;
    this.currentPage = 0;
    this.fetchReviews();
  }
}
