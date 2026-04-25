import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  selectedCategoryName: string = 'All';
  selectedCategoryId: number | null = null;
  searchTerm: string = '';
  isLoading = true;
  isMenuOpen = false;

  currentPage: number = 0;
  pageSize: number = 15;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Categories load error', err)
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAll(
      this.currentPage,
      this.pageSize,
      this.selectedCategoryId,
      this.searchTerm
    ).subscribe({
      next: (data: any) => {
        this.products = data.content || [];
        this.totalPages = data.totalPages || 0;
        this.totalElements = data.totalElements || 0;
        this.isLoading = false;
        window.scrollTo(0, 0);
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  selectCategory(cat: any): void {
    if (cat === 'All') {
      this.selectedCategoryId = null;
      this.selectedCategoryName = 'All';
    } else {
      this.selectedCategoryId = cat.id;
      this.selectedCategoryName = cat.name;
    }
    this.currentPage = 0;
    this.searchTerm = '';
    this.isMenuOpen = false;
    this.loadProducts();
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadProducts();
    }
  }

  openAiChat(): void {
    this.router.navigate(['/user/ai-assistant']);
  }

  askAi(question: string): void {
    this.router.navigate(['/user/ai-assistant'], { queryParams: { query: question } });
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
  }

  goToCart(): void { this.router.navigate(['/user/cart']); }
  goToOrders(): void { this.router.navigate(['/user/orders']); }
  viewDetail(id: number): void { this.router.navigate(['/user/products', id]); }
  goToBecomeSeller(): void {
    this.router.navigate(['/user/become-seller']);
  }
}
