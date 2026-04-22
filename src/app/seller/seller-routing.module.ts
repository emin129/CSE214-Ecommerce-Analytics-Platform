import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { AddProductComponent } from './pages/product-management/add-product/add-product.component';
import { EditProductComponent } from './pages/product-management/edit-product/edit-product.component';
import { SellerOrderListComponent } from './pages/order-management/seller-order-list/seller-order-list.component';
import { AiAssistantComponent } from '../ai-assistant/ai-assistant.component';
import { AnalyticComponent } from './pages/analytic/analytic.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { CustomerProfileComponent } from './pages/customer-profile/customer-profile.component';

const routes: Routes = [
  { path: '', component: PanelComponent },
  { path: 'products/add', component: AddProductComponent },
  { path: 'products/edit/:id', component: EditProductComponent },
  { path: 'orders', component: SellerOrderListComponent },
  { path: 'ai-assistant', component: AiAssistantComponent },
  {path:'analytics',component:AnalyticComponent},
  {path:'reviews',component:ReviewsComponent},
  {path:'customer',component:CustomerProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule {}


