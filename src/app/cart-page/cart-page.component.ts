import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../header/search.service';
import { Product } from '../product-list/product.model';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit, OnDestroy {
  productsInCart!: Product[];
  cartTotalPrice!: number;
  priceArray: number[] = [];
  subscription: Subscription = new Subscription();
  isDataLoaded: boolean = false;
  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.getProductsInCart();
  }

  onChangeTotalPrice(quantity: number) {
    this.cartTotalPrice += quantity;
  }

  getProductsInCart() {
    this.subscription.add(
      this.searchService.getProductArray.subscribe((response) => {
        setTimeout(() => {
          if (response) {
            this.cartTotalPrice = 0;
            this.isDataLoaded = true;
            this.productsInCart = response;
            this.productsInCart.forEach((product) => {
              this.cartTotalPrice += product.price;
            });
          }
        }, 300);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
