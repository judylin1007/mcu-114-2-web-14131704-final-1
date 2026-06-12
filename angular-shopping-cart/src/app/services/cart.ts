import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private productsData: Product[] = [
    {
      id: 1,
      name: '產品 A (熱銷好書)',
      author: '作者 A',
      publisher: '博碩文化',
      price: 280,
      originPrice: 350,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=Book+A',
      description: '這是產品 A 的詳細精彩介紹，探索網頁設計的奧秘。',
      hidden: false
    },
    {
      id: 2,
      name: '產品 B (精選推薦)',
      author: '作者 B',
      publisher: '博碩文化',
      price: 400,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=Book+B',
      description: '這是產品 B 的詳細內容，全面掌握 Angular 核心技術。',
      hidden: false
    },
    {
      id: 3,
      name: '產品 C (限時特惠)',
      author: '作者 C',
      publisher: '博碩文化',
      price: 199,
      originPrice: 300,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=Book+C',
      description: '這是產品 C 的限時促銷，內容豐富，絕對不容錯過。',
      hidden: false
    },
    {
      id: 4,
      name: '隱藏產品 D (測試用)',
      author: '作者 D',
      publisher: '博碩文化',
      price: 500,
      imageUrl: 'https://placehold.co/200x260/e2e8f0/475569?text=Hidden',
      description: '這個產品應該要在清單中被隱藏，不顯示給使用者。',
      hidden: true
    }
  ];

  private cartItemsSignal = signal<CartItem[]>([]);

  constructor() {}

  getProducts(): Product[] {
    return this.productsData.filter(product => !product.hidden);
  }

  getProductById(id: number): Product | undefined {
    return this.productsData.find(product => product.id === id);
  }

  getCartItems() {
    return this.cartItemsSignal.asReadonly();
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      this.cartItemsSignal.set(
        currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
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
    const currentItems = this.cartItemsSignal();
    this.cartItemsSignal.set(
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItemsSignal();
    this.cartItemsSignal.set(currentItems.filter(item => item.product.id !== productId));
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }

  totalItemsCount = computed(() => {
    return this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0);
  });

  totalCartPrice = computed(() => {
    return this.cartItemsSignal().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });
}