import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createOrder(orderRequest: any): Observable<string> {
    return this.http.post(this.apiUrl, orderRequest, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`, {
      headers: this.getHeaders()
    });
  }

  cancelOrder(orderId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${orderId}/refunded`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status?newStatus=${status}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }


  checkReviewEligibility(userId: number, productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-eligibility?userId=${userId}&productId=${productId}`, {
      headers: this.getHeaders()
    });
  }

  createStripeCheckoutSession(items: any[]): Observable<any> {
    return this.http.post('http://localhost:8081/api/payment/create-checkout-session', { items }, {
      headers: this.getHeaders()
    });
  }

  removeOrder(orderId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${orderId}/remove`, {
     headers: this.getHeaders(),
     responseType: 'text'
    });
  }
}
