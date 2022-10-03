import { Injectable } from '@angular/core';
import { FetchDataService } from '../shared/fetch-data.service';
import { Endpoints } from '../shared/endpoints';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Product } from '../product-list/product.model';
import { UserCart } from '../shared/user-cart.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  userSearchTerm: string = '';
  userSelectedCategory: string = '';
  productsId = new Subject<number>();
  productsIdRemove = new Subject<number>();
  productsInCart = new Subject<number[]>();
  getCartSubject = new Subject<number[]>();
  wantCartSubject = new Subject<void>();
  getProductArray = new BehaviorSubject<Product[]>([]);

  constructor(private request: FetchDataService) {}

  getProducts(): Observable<Product[]> {
    return this.request.fetchData<Product[]>(Endpoints.PRODUCTS);
  }

  getProductCategories(): Observable<string[]> {
    return this.request.fetchData<string[]>(Endpoints.CATEGORIES);
  }

  getUserCart(userId: number): Observable<UserCart[]> {
    return this.request.fetchData<UserCart[]>(
      Endpoints.CART + '/user/' + userId
    );
  }
}
