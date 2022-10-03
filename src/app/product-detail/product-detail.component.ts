import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../product-list/product.model';
import { Endpoints } from '../shared/endpoints';
import { FetchDataService } from '../shared/fetch-data.service';
import { UserCart } from '../shared/user-cart.model';
import { SearchService } from '../header/search.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  isDataLoaded: boolean = false;
  isInCart: boolean = false;
  product!: Product;
  id!: String;
  productsByCategory!: Product[];
  subscription!: Subscription;
  sideImages: string[] = [];
  userCart!: UserCart;
  productsId!: number[];

  constructor(
    private route: ActivatedRoute,
    private fetchDataService: FetchDataService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.renderPage();
  }

  renderPage() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id') as String;
      this.isProductInCart();
      this.fetchDataService
        .fetchProduct(Endpoints.PRODUCTS + '/' + this.id)
        .subscribe((resData) => {
          if (resData) {
            this.isDataLoaded = true;
          }
          this.product = resData;
          setTimeout(() => {
            this.setStarRating();
          }, 100);
          this.sideImages = [];
          for (let i = 0; i < 5; i++) {
            this.sideImages.push(this.product.image);
          }
          this.getCategory(this.product, this.product.id);
          if (resData) {
            this.isDataLoaded = true;
          }
        });
    });
  }

  getCategory(product: Product, id: number) {
    this.fetchDataService
      .fetchCategory(Endpoints.CATEGORY + product.category)
      .subscribe((categoryData) => {
        this.productsByCategory = categoryData.filter((product) => {
          return product.id !== id;
        });
      });
  }

  onChangeCart() {
    if (!this.isInCart) {
      this.addToCart();
    } else {
      this.removeFromCart();
    }
  }

  addToCart() {
    this.searchService.productsId.next(+this.id);
    this.isInCart = true;
  }

  removeFromCart() {
    this.searchService.productsIdRemove.next(+this.id);
    this.isInCart = false;
  }

  isProductInCart() {
    this.subscription = this.searchService.productsInCart.subscribe(
      (response) => {
        response = response.filter((productId) => {
          return productId === +this.id;
        });
        if (response.length !== 0) {
          this.isInCart = true;
        } else {
          this.isInCart = false;
        }
      }
    );
    this.searchService.getCartSubject.subscribe((response) => {
      if (response.length > 0) {
        response = response.filter((productId) => {
          return productId === +this.id;
        });
        if (response.length !== 0) {
          this.isInCart = true;
        } else {
          this.isInCart = false;
        }
      }
    });
    this.searchService.wantCartSubject.next();
  }

  setStarRating() {
    const starsRating = document.querySelectorAll('.star-icon-rating');
    for (let index = 0; index < starsRating.length; index++) {
      if (index < Math.round(this.product.rating.rate)) {
        starsRating[index].setAttribute('name', 'star');
      }
    }
    for (
      let index = Math.round(this.product.rating.rate);
      index < starsRating.length;
      index++
    ) {
      starsRating[index].setAttribute('name', 'star-outline');
    }
  }

  onChangeImage(imageContainer: HTMLDivElement) {
    const sideimages = document.querySelectorAll(
      '.container__main__images__side-images__side-image'
    );
    sideimages.forEach((image) => {
      image.classList.remove('active');
      imageContainer.classList.add('active');
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
