import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddProductComponent } from './pages/product-management/add-product/add-product.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from './pages/product-card/product-card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReviewComponent } from './pages/review/review.component';
import { RouterModule } from '@angular/router';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CustomerProfileComponent } from './pages/customer-profile/customer-profile.component';




@NgModule({
  declarations: [
    DashboardComponent,
    UserManagementComponent,
    AddProductComponent,
    AdminProductListComponent,
    EditProductComponent,
    OrderListComponent,
    ProductCardComponent,
    ReviewComponent,
    AnalyticsComponent,
    SettingsComponent,
    CustomerProfileComponent,


  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    RouterModule

  ]
})
export class AdminModule {}
