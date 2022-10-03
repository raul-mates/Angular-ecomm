import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { SearchService } from 'src/app/header/search.service';
import { Product } from 'src/app/product-list/product.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {
  @Input() productInCart!: Product;
  @Output() totalPriceEmit: EventEmitter<number> = new EventEmitter();
  quantity: number = 1;
  itemTotalPrice!: number;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.itemTotalPrice = this.productInCart.price;
  }

  onRaiseQuantity(inputQuantity: HTMLInputElement) {
    this.quantity = +inputQuantity.value;
    if (this.quantity < 5) {
      this.quantity++;
      this.itemTotalPrice = this.productInCart.price * this.quantity;
      this.totalPriceEmit.emit(this.productInCart.price);
      inputQuantity.value = this.quantity as unknown as string;
    } else {
      return;
    }
  }

  onLowerQuantity(inputQuantity: HTMLInputElement) {
    this.quantity = +inputQuantity.value;
    if (this.quantity > 1) {
      this.quantity--;
      this.itemTotalPrice = this.productInCart.price * this.quantity;
      this.totalPriceEmit.emit(-this.productInCart.price);
      inputQuantity.value = this.quantity as unknown as string;
    } else {
      this.searchService.productsIdRemove.next(this.productInCart.id);
      this.totalPriceEmit.emit(-this.productInCart.price);
    }
  }

  onRemoveFromCart() {
    this.searchService.productsIdRemove.next(this.productInCart.id);
    this.totalPriceEmit.emit(-this.productInCart.price);
  }
}
