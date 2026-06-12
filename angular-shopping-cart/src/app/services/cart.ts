import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.ts';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  private cartService = inject(CartService);
  private fb = inject(FormBuilder);

  cartItems = this.cartService.getCartItems();
  totalPrice = this.cartService.totalCartPrice;

  checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]], 
    address: ['', [Validators.required]]
  });

  onIncrement(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  onDecrement(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  onRemove(productId: number) {
    if (confirm('確定要將此書籍從購物車移除嗎？')) {
      this.cartService.removeFromCart(productId);
    }
  }

  get isSubmitDisabled(): boolean {
    return this.cartItems().length === 0 || this.checkoutForm.invalid;
  }

  onSubmit() {
    if (this.isSubmitDisabled) return;

    const orderData = {
      customer: this.checkoutForm.value,
      items: this.cartItems(),
      totalAmount: this.totalPrice()
    };
    
    console.log('訂單送出成功！資料如下：', orderData);
    alert(`🎉 訂單送出成功！\n感謝 ${orderData.customer.name} 的購買，總金額 NT$ ${orderData.totalAmount}。`);
    
    this.checkoutForm.reset();
    this.cartService.clearCart();
  }
}