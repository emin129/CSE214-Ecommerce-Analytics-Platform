import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductListComponent } from './pages/product-list/product-list.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderListComponent } from './pages/order-list/order-list.component';

import { UserRoutingModule } from './user-routing.module';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { BecomeSellerComponent } from './pages/become-seller/become-seller.component';



@NgModule({
  declarations: [
    ProductListComponent,
    CartComponent,
    CheckoutComponent,
    OrderListComponent,
    ProductDetailComponent,
    BecomeSellerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UserRoutingModule
  ]
})
export class UserModule {}

