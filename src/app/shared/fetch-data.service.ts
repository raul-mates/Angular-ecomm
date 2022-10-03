import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLoginData } from '../login-page/login.service';
import { Product } from '../product-list/product.model';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  constructor(private http: HttpClient) {}

  fetchData<TReturn>(url: string): Observable<TReturn> {
    return this.http.get<TReturn>(url);
  }

  fetchProducts(url: string): Observable<Product[]> {
    return this.http.get<Product[]>(url);
  }

  postData<TReturn>(url: string, userData: any): Observable<TReturn> {
    return this.http.post<TReturn>(url, userData);
  }

  fetchProduct(url: string) {
    return this.http.get<Product>(url);
  }

  fetchCategory(url: string) {
    return this.http.get<Product[]>(url);
  }
}
