import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getAll(page: number = 0, size: number = 15): Observable<any> {
    return this.http.get<any>(`${this.api}?page=${page}&size=${size}`, this.getAuthHeaders());
  }

  updateStatus(orderId: any, status: string): Observable<string> {
    const params = new HttpParams().set('newStatus', status);
    return this.http.patch(`${this.api}/${orderId}/status`, {}, {
      ...this.getAuthHeaders(),
      params: params,
      responseType: 'text' as 'json'
    }) as Observable<string>;
  }

  getSellerOrders(): Observable<any> {
    return this.http.get(`${this.api}/seller`, this.getAuthHeaders());
  }

  cancelSellerOrder(orderId: any): Observable<any> {
    return this.http.put(`${this.api}/seller/${orderId}/cancel`, {}, {
      ...this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }
}
