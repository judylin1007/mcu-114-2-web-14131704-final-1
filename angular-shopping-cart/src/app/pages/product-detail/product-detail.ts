import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.ts';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);

  product: Product | undefined;
  
  quantity = signal<number>(1);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const productId = Number(idParam);
      this.product = this.cartService.getProductById(productId);
    }

    if (!this.product) {
      alert('找不到該書籍商品！');
      this.router.navigate(['/products']);
    }
  }

  incrementQty() {
    this.quantity.update(q => q + 1);
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  onAddToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity());
      alert(`已將 ${this.quantity()} 本「${this.product.name}」加入購物車！`);
    }
  }
}