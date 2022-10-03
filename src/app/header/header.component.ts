import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Login } from '../login-page/login.service';
import { Product } from '../product-list/product.model';
import { AuthService } from '../shared/auth.service';
import { FetchDataService } from '../shared/fetch-data.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { User } from '../shared/user.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() userSearchTerm: EventEmitter<string> = new EventEmitter<string>();
  @Output() userSelectedCategory: EventEmitter<string> =
    new EventEmitter<string>();

  filteredProducts: Product[] = [];
  productsForCart: Product[] = [];
  products: Product[] = [];
  productCategories: string[] = [];
  userInputValue!: string;
  userFirstname: string = '';
  productsId: number[] = [];
  cartTotal: number = 0;
  cartTotalPrice: number = 0;
  isSearchInputValid = false;
  isCloseVisible = false;
  productsFromCart: number[] = [];
  isSearchMobileOpen: boolean = false;
  windowWidth: number = window.innerWidth;
  activeUserId: string | unknown = this.localStorageService.get('userId');

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.windowWidth = window.innerWidth;
  }

  private subscription: Subscription = new Subscription();

  constructor(
    private searchService: SearchService,
    private login: Login,
    private fetchDataService: FetchDataService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getProductsCategories();
    this.getUsers();
    this.getUserProductIdsForCart();
    this.getCart();
    this.getActiveUserId();
  }

  getProductsCategories(): void {
    this.subscription.add(
      this.searchService.getProductCategories().subscribe((response) => {
        this.productCategories = response;
      })
    );
  }

  getActiveUserId(): void {
    this.subscription.add(
      this.localStorageService.valueChanges.subscribe((value) => {
        if (value) {
          this.activeUserId = value['userId'] as string;
        }
      })
    );
  }

  getProducts(): void {
    this.subscription.add(
      this.searchService.getProducts().subscribe((response) => {
        if (Array.isArray(response)) {
          this.products = response;
        }
      })
    );
  }

  getUsers(): void {
    this.subscription.add(
      this.login.getUsers().subscribe((response) => {
        response.forEach((user: User) => {
          if (user.username === this.localStorageService.get('username')) {
            this.userFirstname = user.name.firstname;
            this.userFirstname = this.userFirstname.replace(
              this.userFirstname[0],
              this.userFirstname[0].toUpperCase()
            );
          }
        });
      })
    );
  }

  getUserProductIdsForCart(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    const id = this.localStorageService.get('userId') as string;
    if (isLoggedIn && id) {
      this.getUserCartData(+id, this.productsFromCart);
      return;
    }

    this.subscription.add(
      this.localStorageService.valueChanges.subscribe((response) => {
        const userId: string | null = response
          ? (response['userId'] as string)
          : null;

        if (response && userId) {
          this.getUserCartData(+userId, this.productsFromCart);
        }
      })
    );
  }

  getCart() {
    this.searchService.wantCartSubject.subscribe(() => {
      this.searchService.getCartSubject.next(this.productsFromCart);
    });
  }

  getUserCartData(userId: number, productsFromCart: number[]): void {
    this.subscription.add(
      this.searchService.getUserCart(+userId).subscribe((response) => {
        if (!response.length && typeof response !== 'object') {
          return;
        }
        let userCart = response[0];
        userCart.products.forEach((product, index) => {
          if (productsFromCart[index] !== product.productId) {
            productsFromCart.push(product.productId);
          }
        });
        this.searchService.productsInCart.next(productsFromCart);
        this.cartTotal = productsFromCart.length;
        this.productsFromCart = productsFromCart;
        this.getUserCart(this.productsFromCart);
      })
    );
    this.subscription.add(
      this.searchService.productsId.subscribe((response) => {
        productsFromCart.push(response);
        this.searchService.productsInCart.next(productsFromCart);
        this.productsFromCart = productsFromCart;
        this.cartTotal = productsFromCart.length;
        this.getUserCart(this.productsFromCart);
      })
    );
    this.subscription.add(
      this.searchService.productsIdRemove.subscribe((response) => {
        productsFromCart = productsFromCart.filter((productId) => {
          return productId !== response;
        });
        this.searchService.productsInCart.next(productsFromCart);
        this.productsFromCart = productsFromCart;
        this.cartTotal = productsFromCart.length;
        this.getUserCart(this.productsFromCart);
      })
    );
  }

  getUserCart(productsId: number[]) {
    const productsIdArray = productsId;
    let productArray: Product[] = [];
    let cartTotalPrice = 0;

    if (productsIdArray.length > 0) {
      productsIdArray.forEach((productId) => {
        this.subscription.add(
          this.fetchDataService
            .fetchData<Product>(
              `https://fakestoreapi.com/products/${productId}`
            )
            .subscribe((response: Product) => {
              productArray.push(response);
              this.productsForCart = productArray;
              cartTotalPrice += response.price;
              this.cartTotalPrice = cartTotalPrice;
            })
        );
      });
    } else {
      this.cartTotal = 0;
      this.cartTotalPrice = 0;
      this.productsForCart = [];
    }

    this.searchService.getProductArray.next(productArray);
  }

  onSearchInput(event: any, close: HTMLElement) {
    let inputValue = event.target.value;
    this.userInputValue = inputValue;
    this.isSearchInputValid = inputValue.length >= 3;
    if (this.isSearchInputValid) {
      close.classList.remove('hidden');
      this.filteredProducts = this.products.filter((product, i) => {
        if (product.title.toLowerCase().includes(inputValue.toLowerCase())) {
          return product;
        }
        return;
      });
    }
    this.isCloseVisible = !!inputValue;
  }

  onClose(input: HTMLInputElement, dropDown: HTMLElement) {
    dropDown.style.display = 'none';
    input.value = '';
    setTimeout(() => {
      if (this.windowWidth > 1184) {
        input.focus();
      }
    }, 100);
    this.isCloseVisible = false;
  }

  onOutOfFocus(
    input: HTMLInputElement,
    dropDown: HTMLElement,
    close: HTMLElement,
    inputsContainer: HTMLDivElement,
    burgerMenuIcon: HTMLDivElement,
    backToStoreButton: HTMLParagraphElement
  ) {
    let backdrop = document.querySelector('.search-backdrop') as HTMLDivElement;
    backdrop.style.opacity = '0';
    backdrop.style.visibility = 'hidden';
    if (this.windowWidth <= 1184) {
      backToStoreButton.classList.add('hidden');
      burgerMenuIcon.classList.toggle('burger-icon-index-low');
      this.isSearchMobileOpen = false;
    }

    if (!!input) {
      setTimeout(() => {
        dropDown.style.display = 'none';
        close.classList.add('hidden');
        if (this.windowWidth <= 1184) {
          inputsContainer.classList.remove('open-search-mobile');
        }
      }, 100);
    }
  }

  onFocus(
    input: HTMLInputElement,
    dropDown: HTMLElement,
    close: HTMLElement,
    burgerMenuIcon: HTMLDivElement,
    backToStoreButton: HTMLParagraphElement
  ) {
    let backdrop = document.querySelector('.search-backdrop') as HTMLDivElement;
    backdrop.style.opacity = '1';
    backdrop.style.visibility = 'visible';

    if (this.windowWidth <= 1184) {
      backToStoreButton.classList.remove('hidden');
      backdrop.style.background = '#fefefe';
      this.isSearchMobileOpen = true;
      burgerMenuIcon.classList.toggle('burger-icon-index-low');
    } else {
      backdrop.style.background = 'rgba(0, 0, 0, 0.5)';
    }

    if (input && input.value.length > 0) {
      close.classList.remove('hidden');
    }

    if (input.value.length >= 3) {
      dropDown.style.display = 'block';
    }
  }

  onMobileSearchClicked(
    inputsContainer: HTMLDivElement,
    input: HTMLInputElement,
    searchModal: HTMLDivElement,
    backToStoreButton: HTMLParagraphElement
  ) {
    if (this.windowWidth <= 1184) {
      backToStoreButton.classList.remove('hidden');
      inputsContainer.classList.toggle('open-search-mobile');
      searchModal.classList.add('search-modal-mobile');
      this.isSearchMobileOpen = true;
      input.focus();
    }

    if (this.windowWidth > 1184) {
      searchModal.classList.add('hidden');
    }
  }

  callMobileToggles(
    categoriesModalMobile: HTMLDivElement,
    burgerMenuIcon: HTMLDivElement,
    burgerMenuMobile: HTMLDivElement,
    topLine: HTMLDivElement,
    middleLine: HTMLDivElement,
    bottomLine: HTMLDivElement
  ) {
    burgerMenuIcon.classList.toggle('burger-open');
    categoriesModalMobile.classList.toggle('categories-modal-hidden');
    burgerMenuMobile.classList.toggle('hidden');
    topLine.classList.toggle('burger-open--top');
    middleLine.classList.toggle('burger-open--middle');
    bottomLine.classList.toggle('burger-open--bottom');
  }

  onMobileModalClicked(
    categoriesModalMobile: HTMLDivElement,
    burgerMenuIcon: HTMLDivElement,
    burgerMenuMobile: HTMLDivElement,
    topLine: HTMLDivElement,
    middleLine: HTMLDivElement,
    bottomLine: HTMLDivElement
  ) {
    if (this.windowWidth <= 1184) {
      this.callMobileToggles(
        categoriesModalMobile,
        burgerMenuIcon,
        burgerMenuMobile,
        topLine,
        middleLine,
        bottomLine
      );
    }
  }

  onLogout() {
    this.localStorageService.clear();
    this.router.navigate(['/login']);
  }

  onMobileBurgerMenuClicked(
    burgerMenuMobile: HTMLDivElement,
    categoriesModalMobile: HTMLDivElement,
    burgerMenuIcon: HTMLDivElement,
    topLine: HTMLDivElement,
    middleLine: HTMLDivElement,
    bottomLine: HTMLDivElement
  ) {
    this.callMobileToggles(
      categoriesModalMobile,
      burgerMenuIcon,
      burgerMenuMobile,
      topLine,
      middleLine,
      bottomLine
    );
  }

  showAllContaining(
    input: HTMLInputElement,
    dropDown: HTMLElement,
    inputsContainer: HTMLDivElement
  ): void {
    this.userSearchTerm.emit(input.value);
    dropDown.style.display = 'none';
    if (this.windowWidth <= 1184) {
      inputsContainer.classList.toggle('open-search-mobile');
      input.value = '';
    }
    this.router.navigate(['/product-list-page']);
  }

  showProductsInCategory(
    event: Event,
    category: string,
    categoriesModalMobile: HTMLDivElement,
    burgerMenuIcon: HTMLDivElement,
    burgerMenuMobile: HTMLDivElement,
    topLine: HTMLDivElement,
    middleLine: HTMLDivElement,
    bottomLine: HTMLDivElement
  ): void {
    event.preventDefault();
    this.userSelectedCategory.emit(category);
    if (this.windowWidth <= 1184) {
      this.callMobileToggles(
        categoriesModalMobile,
        burgerMenuIcon,
        burgerMenuMobile,
        topLine,
        middleLine,
        bottomLine
      );
    }
    this.router.navigate(['/product-list-page']);
  }

  onMouseOverCart(cartContainer: HTMLDivElement) {
    cartContainer.classList.add('dropdown-open');
    if (cartContainer.classList.contains('dropdown-open')) {
      cartContainer.nextElementSibling!.classList.remove('dropdown-open');
    }
  }

  onMouseLeaveCart(cartContainer: HTMLDivElement) {
    if (cartContainer.classList.contains('dropdown-open')) {
      setTimeout(() => {
        cartContainer.classList.remove('dropdown-open');
      }, 500);
    }
  }

  onMouseOverAccount(accountContainer: HTMLDivElement) {
    accountContainer.classList.add('dropdown-open');
    if (accountContainer.classList.contains('dropdown-open')) {
      accountContainer.previousElementSibling!.classList.remove(
        'dropdown-open'
      );
    }
  }

  onMouseLeaveAccount(accountContainer: HTMLDivElement) {
    if (accountContainer.classList.contains('dropdown-open')) {
      setTimeout(() => {
        accountContainer.classList.remove('dropdown-open');
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
