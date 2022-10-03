import { CartProduct } from './cart-product.model';

export interface UserCart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}
