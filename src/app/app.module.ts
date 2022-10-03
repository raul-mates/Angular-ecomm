import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from './slider/slider.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductItemComponent } from './product-list/product-item/product-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import 'hammerjs';
import { SimilarProductComponent } from './product-detail/similar-product/similar-product.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AccountComponent } from './my-account/account/account.component';
import { OrderHistoryComponent } from './my-account/order-history/order-history.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CartItemComponent } from './cart-page/cart-item/cart-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SliderComponent,
    HeaderComponent,
    ProductListComponent,
    ProductItemComponent,
    ProductDetailComponent,
    SimilarProductComponent,
    CartPageComponent,
    CartItemComponent,
    MyAccountComponent,
    AccountComponent,
    OrderHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
