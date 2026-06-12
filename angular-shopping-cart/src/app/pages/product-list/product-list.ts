import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart'; 
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent {
  private cartService = inject(CartService);

  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = 2;

  allProducts = this.cartService.getProducts();

  filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.allProducts;
    }
    return this.allProducts.filter((p: Product) =>  
      p.name.toLowerCase().includes(query) || 
      p.author.toLowerCase().includes(query)
    );
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize) || 1;
  });

  pagedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(startIndex, startIndex + this.pageSize);
  });

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearchChange() {
    this.currentPage.set(1);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    alert(`已將「${product.name}」加入購物車！`);
  }
}