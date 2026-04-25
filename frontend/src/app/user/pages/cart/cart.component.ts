import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: false
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    public router: Router // Checkout butonu için ekledik
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(index, quantity);
      this.loadCart();
    }
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
    this.loadCart();
  }

  onQuantityChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const quantity = Number(input.value);
    this.updateQuantity(index, quantity);
  }

  // Ödeme sayfasına yönlendirme (İleride ekleyeceğin kısım)
  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/user/checkout']);
    } else {
      alert('Your cart is empty!');
    }
  }
}
