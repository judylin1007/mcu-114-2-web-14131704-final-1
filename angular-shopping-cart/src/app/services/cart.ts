import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private productsData: Product[] = [
    {
      id: 1,
      name: 'A 產品',
      author: '作者 A、作者 B、作者 C',
      publisher: '博碩文化',
      price: 1580,
      originPrice: 1800,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=img',
      description: '',
      hidden: false,
    },
    {
      id: 2,
      name: 'B 產品',
      author: '作者 A、作者 B、作者 C',
      publisher: '博碩文化',
      price: 1580,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=img',
      description: '',
      hidden: false,
    },
    {
      id: 3,
      name: 'C 產品',
      author: '作者 A、作者 B、作者 C',
      publisher: '博碩文化',
      price: 1580,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=img',
      description: '',
      hidden: false,
    },
    {
      id: 4,
      name: 'D 產品',
      author: '作者 A、作者 B、作者 C',
      publisher: '博碩文化',
      price: 1580,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=img',
      description: '',
      hidden: false,
    },
    {
      id: 5,
      name: 'E 產品',
      author: '作者 A、作者 B、作者 C',
      publisher: '博碩文化',
      price: 1580,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=img',
      description: '',
      hidden: false,
    },
    {
      id: 6,
      name: 'F 產品',
      author: '作者 A、作者 B、作者 C',
      publisher: '博碩文化',
      price: 1580,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=img',
      description: '',
      hidden: false,
    },
    {
      id: 7,
      name: 'G 產品',
      author: '作者 A、作者 B、作者 C',
      publisher: '博碩文化',
      price: 1580,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=img',
      description: '',
      hidden: false,
    },
  ];

  private cartItemsSignal = signal<CartItem[]>([]);

  getProducts(): Product[] {
    return this.productsData.filter((product) => !product.hidden);
  }

  getProductById(id: number): Product | undefined {
    return this.productsData.find((product) => product.id === id);
  }

  getCartItems() {
    return this.cartItemsSignal.asReadonly();
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find((item) => item.product.id === product.id);
    if (existingItem) {
      this.cartItemsSignal.set(
        currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      );
    } else {
      this.cartItemsSignal.set([...currentItems, { product, quantity }]);
    }
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItemsSignal.set(
      this.cartItemsSignal().map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  removeFromCart(productId: number) {
    this.cartItemsSignal.set(
      this.cartItemsSignal().filter((item) => item.product.id !== productId),
    );
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }

  totalItemsCount = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0),
  );
  totalCartPrice = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
}
