import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartPageComponent } from './cart-page/cart-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AccountComponent } from './my-account/account/account.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { OrderHistoryComponent } from './my-account/order-history/order-history.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'product-list-page',
    component: ProductListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product-detail-page/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-account/:id',
    component: MyAccountComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'account-details',
        component: AccountComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'order-history',
        component: OrderHistoryComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'cart-page',
    component: CartPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
