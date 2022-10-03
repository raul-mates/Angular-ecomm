import { Injectable } from '@angular/core';
import { FetchDataService } from '../shared/fetch-data.service';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private fetchDataService: FetchDataService) {}
  public products: Product[] = [];
  sortFunction(sortingMethod: string, products: Product[]) {
    switch (sortingMethod) {
      case 'DescendingbyPrice':
        products.sort(this.comparePriceDesc);
        break;
      case 'AscendingbyPrice':
        products.sort(this.comparePriceAsc);
        break;
      case 'DescendingbyName':
        products.sort(this.compareZToA);
        break;
      case 'AscendingbyName':
        products.sort(this.compareAToZ);
        break;
    }
  }

  comparePriceAsc(a: Product, b: Product) {
    return Number(a.price) - Number(b.price);
  }
  comparePriceDesc(a: Product, b: Product) {
    return Number(b.price) - Number(a.price);
  }
  compareAToZ(a: Product, b: Product) {
    return a.title.localeCompare(b.title);
  }
  compareZToA(a: Product, b: Product) {
    return b.title.localeCompare(a.title);
  }
}
