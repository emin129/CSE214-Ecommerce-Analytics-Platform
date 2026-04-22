import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SellerRoutingModule } from './seller-routing.module';
import { PanelComponent } from './panel/panel.component';
import { AddProductComponent } from './pages/product-management/add-product/add-product.component';
import { EditProductComponent } from './pages/product-management/edit-product/edit-product.component';
import { SellerOrderListComponent } from './pages/order-management/seller-order-list/seller-order-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AnalyticComponent } from './pages/analytic/analytic.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { CustomerProfileComponent } from './pages/customer-profile/customer-profile.component';

@NgModule({
  declarations: [
    PanelComponent,
    AddProductComponent,
    EditProductComponent,
    SellerOrderListComponent,
    AnalyticComponent,
    ReviewsComponent,
    CustomerProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SellerRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class SellerModule { }



