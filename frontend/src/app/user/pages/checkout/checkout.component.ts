import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId: number | null = null;

  stripe: any;
  cardNumberElement: any;
  cardExpiryElement: any;
  cardCvcElement: any;

  isStripeLoading = false;
  stripeError: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private http: HttpClient,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      alert('Please log in to continue.');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartItems = this.cartService.getCart();
    this.totalPrice = this.cartService.getTotalPrice();
    this.initStripe();
  }

  initStripe(): void {
    // Kendi Publishable Key'in
    this.stripe = Stripe('pk_test_51TNMeP2OR0OXl6JnIkv2hBFtQ3jYbJnCZYz5Nlr8yeIBLas0Nvs0HOdIuxGWxPkLZjlZ9yNqTCokmtbcTOWmqTjR008eJ8VZvX');
    const elements = this.stripe.elements();

    const style = {
      base: {
        color: '#ffffff',
        fontFamily: '"Inter", sans-serif',
        fontSize: '16px',
        '::placeholder': { color: '#94a3b8' }
      },
      invalid: {
        color: '#ef4444'
      }
    };

    // Her alanı ayrı ayrı oluşturuyoruz
    this.cardNumberElement = elements.create('cardNumber', { style, showIcon: true });
    this.cardExpiryElement = elements.create('cardExpiry', { style });
    this.cardCvcElement = elements.create('cardCvc', { style });

    // DOM'un yüklenmesi için kısa bir gecikmeyle mount ediyoruz
    setTimeout(() => {
      this.cardNumberElement.mount('#card-number');
      this.cardExpiryElement.mount('#card-expiry');
      this.cardCvcElement.mount('#card-cvc');
    }, 500);
  }

  async confirmStripePayment() {
    if (this.cartItems.length === 0) return;

    this.isStripeLoading = true;
    this.stripeError = '';

    // Backend'e cent biriminden gönderiyoruz (Örn: 25.00$ -> 2500)
    const paymentData = {
      amount: Math.round(this.totalPrice * 100),
      currency: 'usd'
    };

    this.http.post<any>('http://localhost:8081/api/payment/create-payment-intent', paymentData).subscribe({
      next: async (res) => {
        const { paymentIntent, error } = await this.stripe.confirmCardPayment(res.clientSecret, {
          payment_method: {
            card: this.cardNumberElement
          }
        });

        if (error) {
          this.stripeError = error.message;
          this.isStripeLoading = false;
        } else if (paymentIntent.status === 'succeeded') {
          this.completeOrderProcess();
        }
      },
      error: (err) => {
        this.stripeError = "Payment server is unreachable.";
        this.isStripeLoading = false;
      }
    });
  }

  completeOrderProcess(): void {
    const orderPayload = {
      userId: this.userId,
      status: 'PENDING',
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        alert('Payment Received & Order Placed Successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/user/orders']);
      },
      error: (err) => {
        alert('Payment was successful, but we could not save the order. Please contact us.');
        this.isStripeLoading = false;
      }
    });
  }
}
