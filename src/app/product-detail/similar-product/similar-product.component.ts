import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/product-list/product.model';

@Component({
  selector: 'app-similar-product',
  templateUrl: './similar-product.component.html',
  styleUrls: ['./similar-product.component.scss'],
})
export class SimilarProductComponent implements OnInit {
  @Input() productByCategory!: Product;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onChangeProduct() {
    this.router.navigate(['product-detail-page/', this.productByCategory.id]);
  }
}
