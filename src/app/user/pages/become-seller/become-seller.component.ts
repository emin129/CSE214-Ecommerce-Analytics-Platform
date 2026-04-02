import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-become-seller',
  templateUrl: './become-seller.component.html',
  styleUrls: ['./become-seller.component.css'],
  standalone: false
})
export class BecomeSellerComponent {
  // Description'ı kaldırdık, sadece gerekli olanlar
  sellerData = {
    storeName: '',
    city: ''
  };
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;

    // URL düzeltildi (api/user), responseType eklendi
    this.http.post('http://localhost:8081/api/user/become-seller', this.sellerData, {
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert('Congratulations! Your store is now active. Please re-login to see the seller panel.');
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Upgrade error:', err);
        alert('Failed to upgrade to seller. Please check your connection or login status.');
        this.isLoading = false;
      }
    });
  }
}
