import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, CartItem } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000';

  private cartItemsSignal = signal<CartItem[]>([]);

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  submitOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }

  get cartItems() {
    return this.cartItemsSignal.asReadonly();
  }

  totalCount = computed(() => {
    return this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartItemsSignal().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  });

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      this.cartItemsSignal.set([...currentItems, { product, quantity }]);
    }
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updatedItems = this.cartItemsSignal().map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.cartItemsSignal.set(updatedItems);
  }

  removeFromCart(productId: string) {
    const updatedItems = this.cartItemsSignal().filter((item) => item.product.id !== productId);
    this.cartItemsSignal.set(updatedItems);
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }
}
