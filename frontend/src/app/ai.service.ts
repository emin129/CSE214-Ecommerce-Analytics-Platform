import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AIService {
  private apiUrl = 'http://localhost:8081/api/ai/query';

  constructor(private http: HttpClient) {}

  queryProductAI(userQuery: string, fullContext: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);


    const userJson = localStorage.getItem('user');
    let currentUserId: number = 1;
    let currentUserRole: string = 'CUSTOMER';

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        currentUserId = userObj.id;
        currentUserRole = userObj.role;
      } catch (e) {
        console.error("User object parse hatası:", e);
      }
    }


    return this.http.post<any>(this.apiUrl, {
      userPrompt: userQuery,
      securityContext: fullContext,
      userId: currentUserId,
      userRole: currentUserRole
    }, { headers });
  }
}
