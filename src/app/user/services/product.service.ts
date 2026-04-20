import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/products';
  private sellerApi = 'http://localhost:8081/api/seller/products';
  private catApi = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      })
    };
  }

  getAll(page: number, size: number, categoryId: number | null, searchTerm: string = ''): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&size=${size}`;

    if (categoryId !== null) {
      url += `&categoryId=${categoryId}`;
    }

    if (searchTerm && searchTerm.trim() !== '') {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    return this.http.get<any>(url, this.getHeaders());
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.catApi, this.getHeaders());
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  getSellerProducts(page: number, size: number): Observable<any> {
    const url = `${this.sellerApi}?page=${page}&size=${size}`;
    return this.http.get<any>(url, this.getHeaders());
  }

  saveProduct(product: any): Observable<any> {
    if (product.id) {
      return this.http.put(`${this.sellerApi}/${product.id}`, product, this.getHeaders());
    }
    return this.http.post(this.sellerApi, product, this.getHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.sellerApi}/${id}`, this.getHeaders());
  }

  getSellerReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.sellerApi}/reviews`, this.getHeaders());
  }
}
