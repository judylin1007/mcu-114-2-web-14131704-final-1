import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  allProducts = signal<Product[]>([]);
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = 5;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getProducts().subscribe({
      next: (data) => this.allProducts.set(data),
      error: (err) => console.error('無法取得產品資料：', err),
    });
  }

  filteredProducts = computed(() => {
    return this.allProducts().filter((product) => {
      const isNotHidden = !product.hidden;
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery().toLowerCase());
      return isNotHidden && matchesSearch;
    });
  });

  paginatedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() => {
    const count = this.filteredProducts().length;
    return Math.ceil(count / this.pageSize) || 1;
  });

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  onSearch() {
    this.currentPage.set(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
  }
}
