import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();
    console.log("AdminGuard çalıştı, Kullanıcı Rolü:", role);

    if (role === 'ADMIN') {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
