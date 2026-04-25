import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: false
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  jumpPage: number = 1;
  searchTerm: string = '';

  private adminApi = 'http://localhost:8081/api/admin/users';
  private userApi = 'http://localhost:8081/api/user';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    let url = '';

    if (this.searchTerm.trim()) {
      url = `${this.userApi}/search?username=${this.searchTerm}&page=${this.currentPage}&size=${this.pageSize}`;
    } else {
      url = `${this.adminApi}?page=${this.currentPage}&size=${this.pageSize}`;
    }

    this.http.get<any>(url, { headers: this.getHeaders() })
      .subscribe({
        next: (response: any) => {
          this.users = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Retrieval failed:", error);
          this.isLoading = false;
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  goToPage(): void {
    if (!this.jumpPage) return;
    let page = this.jumpPage - 1;
    if (page < 0) page = 0;
    if (page >= this.totalPages) page = this.totalPages - 1;
    this.currentPage = page;
    this.loadUsers();
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure?')) {
      this.http.delete(`${this.adminApi}/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            if (this.users.length === 1 && this.currentPage > 0) {
              this.currentPage--;
            }
            this.loadUsers();
          },
          error: (error) => console.error("Deletion failed:", error)
        });
    }
  }

  updateRole(id: number, role: string): void {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    this.http.put(`${this.adminApi}/${id}/role`, { role }, {
      headers,
      responseType: 'text'
    })
      .subscribe({
        next: () => {
          alert('Role updated successfully.');
          this.loadUsers();
        },
        error: (error) => console.error("Update failed:", error)
      });
  }

  banUser(id: number): void {
    this.http.put(`${this.adminApi}/${id}/ban`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).subscribe({
      next: () => this.loadUsers(),
      error: (error) => console.error("Ban failed:", error)
    });
  }

  unbanUser(id: number): void {
    this.http.put(`${this.adminApi}/${id}/unban`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).subscribe({
      next: () => this.loadUsers(),
      error: (error) => console.error("Unban failed:", error)
    });
  }
}
