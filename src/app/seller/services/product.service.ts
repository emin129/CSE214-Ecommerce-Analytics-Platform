import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/seller/products';
  private reviewUrl = 'http://localhost:8081/api/reviews/seller';
  private orderUrl = 'http://localhost:8081/api/seller/orders';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSellerProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getSellerReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.reviewUrl, { headers: this.getHeaders() });
  }

  getSellerOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.orderUrl, { headers: this.getHeaders() });
  }

  postReply(reviewId: number, replyText: string): Observable<any> {
    const url = `http://localhost:8081/api/reviews/${reviewId}/reply`;
    return this.http.post(url, { replyText }, { headers: this.getHeaders() });
  }

  create(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product, { headers: this.getHeaders() });
  }

  update(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8081/api/categories', { headers: this.getHeaders() });
  }
}
