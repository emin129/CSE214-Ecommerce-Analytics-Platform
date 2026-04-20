import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../review.service';

@Component({
  selector: 'app-review',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  standalone: false
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  isLoading: boolean = true;

  stats = {
    total: 0,
    average: 0,
    fiveStar: 0,
    oneStar: 0
  };

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getSellerReviews().subscribe({
      next: (data: any) => {
        const allData = data.content || data;

        this.calculateGlobalStats(allData);

        this.reviews = allData.filter((r: any) => !r.sellerReply);
        this.filteredReviews = [...this.reviews];

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching reviews:', err);
        this.isLoading = false;
      }
    });
  }

  calculateGlobalStats(allReviews: any[]): void {
    const totalCount = allReviews.length;

    if (totalCount === 0) {
      this.stats = { total: 0, average: 0, fiveStar: 0, oneStar: 0 };
      return;
    }

    const sum = allReviews.reduce((acc, curr) => acc + (curr.starRating || 0), 0);

    this.stats = {
      total: allReviews.filter(r => !r.sellerReply).length,
      average: Math.round((sum / totalCount) * 10) / 10,
      fiveStar: allReviews.filter(r => r.starRating === 5).length,
      oneStar: allReviews.filter(r => r.starRating === 1).length
    };
  }

  submitReply(review: any, replyText: string): void {
    if (!replyText || !replyText.trim()) return;
    this.reviewService.postReviewReply(review.id, replyText).subscribe({
      next: () => {
        this.removeFromLists(review.id);
      },
      error: (err: any) => {
        console.error('Error submitting reply:', err);
        alert('Action failed. Check permissions.');
      }
    });
  }

  removeReview(reviewId: number): void {
    if (confirm('Are you sure?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => this.removeFromLists(reviewId),
        error: (err: any) => {
          console.error('Delete failed:', err);
          alert('Could not delete the review.');
        }
      });
    }
  }

  private removeFromLists(id: number): void {
    this.reviews = this.reviews.filter(r => r.id !== id);
    this.filteredReviews = this.filteredReviews.filter(r => r.id !== id);

    this.reviewService.getSellerReviews().subscribe({
      next: (data: any) => {
        const allData = data.content || data;
        this.calculateGlobalStats(allData);
      }
    });
  }
}
