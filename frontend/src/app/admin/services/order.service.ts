import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  updateStatus(id: number, status: string): Observable<string> {
    return this.http.patch(`http://localhost:8081/api/admin/orders/${id}/status`,
      { status },
      { ...this.getAuthHeaders(), responseType: 'text' }
    );
  }


  refund(id: number): Observable<string> {
    return this.http.put(`http://localhost:8081/api/admin/orders/${id}/refund`,
      {},
      { ...this.getAuthHeaders(), responseType: 'text' }
    );
  }
}
