import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.css',
  standalone: false
})
export class AdminProductListComponent implements OnInit {

  products: any[] = [];
  currentPage: number = 0;
  pageSize: number = 9;
  totalElements: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  jumpPage: number = 1;
  searchTerm: string = '';
  categories: any[] = [];
  selectedCategory: number | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService
      .getAll(this.currentPage, this.pageSize, this.searchTerm, this.selectedCategory)
      .subscribe({
        next: (data: any) => {
          this.products = data.content;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  goToPage(): void {
    const page = this.jumpPage - 1;
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  editProduct(product: any): void {
    this.router.navigate(['/admin/products/edit', product.id]);
  }

  deleteProduct(product: any): void {
    if (confirm('Are you sure you want to archive this product?')) {
      this.isLoading = true;
      this.productService.delete(product.id).subscribe({
        next: () => {
          if (this.products.length === 1 && this.currentPage > 0) {
            this.currentPage--;
          }
          this.loadProducts();
        },
        error: (err) => {
          console.error('Delete operation failed', err);
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.currentPage = 0;
    this.jumpPage = 1;
    this.loadProducts();
  }
}
