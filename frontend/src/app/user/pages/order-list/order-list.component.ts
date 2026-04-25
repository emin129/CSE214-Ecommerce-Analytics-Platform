import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: false
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  userId: number | null = null;
  isLoading = true;
  private readonly STORAGE_KEY = 'hidden_orders';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId !== null) {
      this.loadOrders();
    } else {
      this.isLoading = false;
    }
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getUserOrders(this.userId!).subscribe({
      next: (data) => {
        const hiddenIds = this.getHiddenOrderIds();
        this.orders = data.filter((o: any) => !hiddenIds.includes(o.id));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Order load error:', err);
        this.isLoading = false;
      }
    });
  }

  removeOrder(orderId: number): void {
    if (confirm('Are you sure you want to remove this order from history?')) {
      const hiddenIds = this.getHiddenOrderIds();
      if (!hiddenIds.includes(orderId)) {
        hiddenIds.push(orderId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(hiddenIds));
      }
      this.orders = this.orders.filter(o => o.id !== orderId);
    }
  }

  private getHiddenOrderIds(): number[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => this.loadOrders(),
        error: () => alert('Failed to cancel order.')
      });
    }
  }

  goToReview(productId: any): void {
    if (!productId) return;
    this.router.navigate(['/user/products', productId]);
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    const s = status.trim().toUpperCase();
    switch (s) {
      case 'DELIVERED': return 'status-delivered';
      case 'SHIPPED': return 'status-shipped';
      case 'PENDING': return 'status-pending';
      case 'CANCELED':
      case 'REFUNDED': return 'status-canceled';
      default: return '';
    }
  }
}
