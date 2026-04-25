import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl:'./register.component.css',
  standalone: false
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.username || !this.email || !this.password) {
      alert('Please fill all fields.');
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        alert('Registration successful');
        this.username = '';
        this.email = '';
        this.password = '';
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        if (err.status === 400) {
          alert('Username or email already exists.');
        } else {
          alert('Registration failed.');
        }
      }
    });
  }
}



