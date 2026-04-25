import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Mevcut Componentler
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { AddProductComponent } from './pages/product-management/add-product/add-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { AiAssistantComponent } from '../ai-assistant/ai-assistant.component';
import { ReviewComponent } from './pages/review/review.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

import { SettingsComponent } from './pages/settings/settings.component';
import { CustomerProfileComponent } from './pages/customer-profile/customer-profile.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'products', component: AdminProductListComponent },
  { path: 'products/add', component: AddProductComponent },
  { path: 'products/edit/:id', component: EditProductComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'ai-assistant', component: AiAssistantComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'settings', component: SettingsComponent },
  {path:'customerProfile',component:CustomerProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
