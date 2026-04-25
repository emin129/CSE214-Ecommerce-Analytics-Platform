import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreReportDTO } from '../../storeDTO';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private apiUrl = 'http://localhost:8081/api/stores';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getStoreReports(page: number, size: number, ownerName: string = ''): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('ownerName', ownerName);

    return this.http.get<any>(`${this.apiUrl}/reports`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  updateStoreStatus(id: number, status: string): Observable<string> {
    const params = new HttpParams().set('status', status);

    return this.http.put(
      `${this.apiUrl}/${id}/status`,
      null,
      {
        params,
        headers: this.getAuthHeaders(),
        responseType: 'text'
      }
    );
  }

  exportReports(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/export`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}
