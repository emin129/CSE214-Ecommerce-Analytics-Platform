import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AiAssistantComponent } from '../ai-assistant/ai-assistant.component';
import { BecomeSellerComponent } from './pages/become-seller/become-seller.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'ai-assistant', component: AiAssistantComponent },
  {path:'product-list',component:ProductListComponent},
  {path:'become-seller',component:BecomeSellerComponent},
  {path:'Product-details/:id',component:ProductDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
