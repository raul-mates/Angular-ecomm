import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FetchDataService } from 'src/app/shared/fetch-data.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { UserCart } from 'src/app/shared/user-cart.model';
import { map, Subscription } from 'rxjs';
import { Endpoints } from 'src/app/shared/endpoints';
import { Product } from 'src/app/product-list/product.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  previousOrders: UserCart[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private fetchData: FetchDataService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.renderUserCartData();
  }

  renderUserCartData() {
    this.subscription.add(
      this.getUserCart()
        .pipe(
          map((orders) => {
            orders.map((order) => {
              let orderDate = new Date(order.date);
              order.date = `${orderDate}`;
              this.previousOrders.push(order);

              order.products.forEach((product) => {
                this.fetchData
                  .fetchData<Product>(
                    Endpoints.PRODUCTS + `/${product.productId}`
                  )
                  .subscribe((response: Product) => {
                    product.title = response.title;
                  });
              });
            });
          })
        )
        .subscribe()
    );
  }

  getUserCart() {
    return this.fetchData.fetchData<UserCart[]>(
      `https://fakestoreapi.com/carts/user/${this.localStorage.get('userId')}`
    );
  }

  onExpandButtonClicked(
    detailsWrapper: HTMLDivElement,
    expandButtonChevron1: HTMLElement,
    expandButtonChevron2: HTMLElement
  ) {
    detailsWrapper.classList.toggle('expand');

    if (detailsWrapper.classList.contains('expand')) {
      expandButtonChevron1.style.transform = 'rotate(-180deg)';
      expandButtonChevron2.style.transform = 'rotate(-180deg)';
    } else {
      expandButtonChevron1.style.transform = 'rotate(0deg)';
      expandButtonChevron2.style.transform = 'rotate(0deg)';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
