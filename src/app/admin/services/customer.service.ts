import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCustomerService {
  private baseUrl = 'http://localhost:8081/api/admin/customer-profiles';

  constructor(private http: HttpClient) { }

  getIncompleteProfiles(page: number, size: number, searchTerm: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get(`${this.baseUrl}/incomplete`, { params });
  }

  updateProfile(id: string, profile: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, profile);
  }
}
