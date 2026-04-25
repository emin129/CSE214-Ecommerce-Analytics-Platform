import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
  const expectedRole = route.data['role']; // Örn: 'ROLE_ADMIN' veya 'ADMIN'
  const isLoggedIn = this.authService.isLoggedIn();
  const userRole = this.authService.getRole(); // Backend'den gelen 'ADMIN'

  if (!isLoggedIn) {
    this.router.navigate(['/auth/login']);
    return false;
  }

  if (expectedRole) {
    // 1. Beklenen roldeki 'ROLE_' ekini temizleyip sadece 'ADMIN' yapıyoruz
    const normalizedExpectedRole = expectedRole.replace('ROLE_', '');

    // 2. Mevcut roldeki 'ROLE_' ekini de temizleyip sadece 'ADMIN' yapıyoruz (Garanti olsun diye)
    const normalizedUserRole = userRole ? userRole.replace('ROLE_', '') : '';

    console.log(`[Guard Kontrolü] Beklenen: ${normalizedExpectedRole} | Mevcut: ${normalizedUserRole}`);

    // Artık 'ADMIN' === 'ADMIN' olacağı için pürüzsüzce geçecektir.
    if (normalizedUserRole !== normalizedExpectedRole) {
      console.warn("❌ Yetkisiz Giriş! Login'e yönlendiriliyorsunuz.");
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  return true;
}
}
