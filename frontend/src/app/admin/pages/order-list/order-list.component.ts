import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: false
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  isLoading: boolean = true;

  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 15;

  jumpPage: number = 1;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.isLoading = true;

    this.orderService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.orders = response.content || response;
        this.totalElements = response.totalElements || this.orders.length;
        this.totalPages = response.totalPages || 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error while loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.jumpPage = page + 1;
      this.loadAllOrders();
    }
  }

  goLastPage(): void {
    this.currentPage = this.totalPages - 1;
    this.jumpPage = this.totalPages;
    this.loadAllOrders();
  }

  onStatusChange(event: any, id: any): void {
    const newStatus = event.target.value;

    this.orderService.updateStatus(id, newStatus).subscribe({
      next: () => {
        alert('Status updated successfully.');
        this.loadAllOrders();
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Status update failed! Check backend logs.');
      }
    });
  }

  refundOrder(id: any): void {
    if (confirm('Are you sure you want to refund this order?')) {
      this.orderService.refund(id).subscribe({
        next: (msg) => {
          alert(msg || 'Refund completed successfully.');
          this.loadAllOrders();
        },
        error: (err) => {
          console.error('Refund error:', err);
          alert('Refund failed.');
        }
      });
    }
  }

  trackByOrder(index: number, order: any) {
    return order.id || order.orderId || index;
  }
}
