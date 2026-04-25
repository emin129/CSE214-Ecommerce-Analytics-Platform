import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] ,
  standalone:false
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.authService.saveUser(res.user);
        this.authService.saveRole(res.user.role);

        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (res.user.role === 'SELLER') {
          this.router.navigate(['/seller']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: () => {
        alert('Invalid credentials');
      }
    });
  }


  }

