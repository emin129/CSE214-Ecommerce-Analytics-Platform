import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'seller',
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SELLER' },
    loadChildren: () => import('./seller/seller.module').then(m => m.SellerModule)
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    data: { role: 'ROLE_USER' },
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },

  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
