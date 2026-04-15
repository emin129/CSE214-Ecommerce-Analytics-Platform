import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor() {
    // Uygulama başladığında hafızadaki sepeti yükle
    this.loadCartFromStorage();
  }

  getCart(): any[] {
    return this.cart;
  }

  addToCart(product: any, quantity: number = 1): void {
    // 'product.product.id' veya 'product.id' karmaşasını önlemek için kontrol
    const productId = product.id;
    const index = this.cart.findIndex(item => item.product.id === productId);

    if (index > -1) {
      this.cart[index].quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    this.saveCartToStorage(); // Her değişiklikte kaydet
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity > 0 && this.cart[index]) {
      this.cart[index].quantity = quantity;
      this.saveCartToStorage();
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cart = [];
    localStorage.removeItem('cart'); // Hafızayı temizle
  }

  getTotalPrice(): number {
    return this.cart.reduce((sum, item) => {
      // Sayısal hataları önlemek için 'Number' casting
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);
  }

  // --- LocalStorage Lojiği ---

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        console.error('Could not parse cart from storage', e);
        this.cart = [];
      }
    }
  }
}
