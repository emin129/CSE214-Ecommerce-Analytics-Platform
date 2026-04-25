import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewDTO } from './ReviewDTO';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8081/api/reviews';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSellerReviews(): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.apiUrl}/seller`, { headers: this.getHeaders() });
  }

  postReviewReply(reviewId: number, replyText: string): Observable<ReviewDTO> {
    const headers = this.getHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<ReviewDTO>(`${this.apiUrl}/admin/${reviewId}/reply`, replyText, { headers: headers });
  }

  getAllReviewsForAdmin(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/all?page=${page}&size=${size}`, { headers: this.getHeaders() });
  }

  searchReviewsByProduct(productId: number, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/search?productId=${productId}&page=${page}&size=${size}`, { headers: this.getHeaders() });
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${reviewId}`, { headers: this.getHeaders() });
  }

  getProductReviews(productId: number, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${productId}?page=${page}&size=${size}`);
  }

  getAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/product/${productId}/average`);
  }

  postReview(review: any): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(this.apiUrl, review, { headers: this.getHeaders().set('Content-Type', 'application/json') });
  }
}
