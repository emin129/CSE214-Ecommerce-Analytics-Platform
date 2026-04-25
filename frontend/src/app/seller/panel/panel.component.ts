import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  standalone: false
})
export class PanelComponent implements OnInit {

  products: any[] = [];
  reviews: any[] = [];
  averageRating: number = 0;
  isLoading = true;

  currentPage: number = 0;
  pageSize: number = 8;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(
    private productService: ProductService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
   (this.productService as any).getSellerProducts(this.currentPage, this.pageSize).subscribe({
    next: (data: any) => {
        this.products = data.content || data;
        this.totalElements = data.totalElements || this.products.length;
        this.totalPages = data.totalPages || 1;
        this.loadSellerReviews();
      },
      error: (err:any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDashboardData();
  }

  loadSellerReviews(): void {
    this.productService.getSellerReviews().subscribe({
      next: (data: any) => {
        this.reviews = data.content || data;
        this.calculateAverage();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  calculateAverage(): void {
    if (this.reviews && this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, curr) => acc + (curr.starRating || 0), 0);
      this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    } else {
      this.averageRating = 0;
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  addProduct(): void {
    this.router.navigate(['/seller/products/add']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/seller/products/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err) => console.error(err)
      });
    }
  }

  goToOrders(): void {
    this.router.navigate(['/seller/orders']);
  }

  goToAI(): void {
    this.router.navigate(['/seller/ai-assistant']);
  }

  goToAnalytics(): void {
    this.router.navigate(['/seller/analytics']);
  }

  goToReviews(): void {
    this.router.navigate(['/seller/reviews']);
  }

  goToCustomer(): void {
    this.router.navigate(['/seller/customer']);
  }
}
