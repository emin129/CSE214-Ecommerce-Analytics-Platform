import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api = 'http://localhost:8081/api/admin/products';
  private categoryApi = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  getAll(page: number, size: number, search: string = '', categoryId: number | null = null): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search && search.trim()) {
      params = params.set('search', search);
    }

    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get<any>(this.api, {
      headers: this.getHeaders(),
      params: params
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`, { headers: this.getHeaders() });
  }

  create(product: any): Observable<any> {
    return this.http.post<any>(this.api, product, { headers: this.getHeaders() });
  }

  update(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, product, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoryApi, { headers: this.getHeaders() });
  }
}
