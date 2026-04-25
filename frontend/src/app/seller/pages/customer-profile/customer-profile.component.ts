import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-seller-customers',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
  standalone: false
})
export class CustomerProfileComponent implements OnInit {
  customers: any[] = [];
  isLoading = true;
  searchTerm: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getSellerCustomers(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (data: any) => {
        this.customers = data.content || [];
        this.totalElements = data.totalElements || 0;
        this.totalPages = data.totalPages || 0;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load customers:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadCustomers();
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadCustomers();
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}
