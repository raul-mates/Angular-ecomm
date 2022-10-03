import { Component, OnInit } from '@angular/core';
import { FetchDataService } from '../shared/fetch-data.service';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { Endpoints } from '../shared/endpoints';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  products!: Product[];

  constructor(
    private fetchDataService: FetchDataService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchDataService
      .fetchProducts(Endpoints.PRODUCTS)
      .subscribe((resData) => {
        this.products = resData;
      });
  }

  onSort(event: any) {
    const selectedOption = event.target.value;
    this.productService.sortFunction(selectedOption, this.products);
  }

  onSearchTermEntered(searchValue: string) {
    this.searchTerm = searchValue;
    this.fetchDataService
      .fetchProducts(Endpoints.PRODUCTS)
      .subscribe((resData: Product[]) => {
        this.products = resData.filter((product): Product | void => {
          if (
            product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) {
            return product;
          }
        });
      });
  }

  onSelectedCategory(category: string) {
    this.selectedCategory = category;

    this.fetchDataService
      .fetchData(Endpoints.PRODUCTS + `/category/${category}`)
      .subscribe((resData) => {
        this.products = resData as Product[];
      });
  }
}
