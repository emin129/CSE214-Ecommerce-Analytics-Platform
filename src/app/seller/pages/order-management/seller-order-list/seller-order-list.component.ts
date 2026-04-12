import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-seller-order-list',
  templateUrl: './seller-order-list.component.html',
  styleUrls: ['./seller-order-list.component.css'],
  standalone: false
})
export class SellerOrderListComponent implements OnInit {
  orders: any[] = [];
  isLoading = true; // Premium feel için loading state

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getSellerOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Order fetch error:', err);
        alert('Failed to load your orders. Please check your connection.');
        this.isLoading = false;
      }
    });
  }

  updateStatus(orderId: number, newStatus: string): void {
    this.orderService.updateStatus(orderId, newStatus).subscribe({
      next: () => {
        alert(`Order #${orderId} status updated to ${newStatus}`);
        this.loadOrders();
      },
      error: () => alert('Failed to update status. You might not have permission.')
    });
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      this.orderService.cancelSellerOrder(orderId).subscribe({
        next: () => {
          alert('Order has been cancelled.');
          this.loadOrders();
        },
        error: () => alert('Failed to cancel order.')
      });
    }
  }

  onStatusChange(event: Event, orderId: number): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.updateStatus(orderId, newStatus);
  }
}
