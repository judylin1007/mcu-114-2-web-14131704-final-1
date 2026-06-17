import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCartComponent {
  public cartService = inject(CartService);
  private fb = inject(FormBuilder);

  orderForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onQuantityChange(productId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  get canSubmit(): boolean {
    return this.orderForm.valid && this.cartService.cartItems().length > 0;
  }

  onSubmit() {
    if (!this.canSubmit) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const orderData = {
      customer: this.orderForm.value,
      items: this.cartService.cartItems(),
      totalPrice: this.cartService.totalPrice(),
      date: new Date().toISOString(),
    };

    this.cartService.submitOrder(orderData).subscribe({
      next: (res) => {
        alert('訂單送出成功！');
        this.cartService.clearCart();
        this.orderForm.reset();
      },
      error: (err) => {
        alert('訂單送出失敗，請檢查後端服務是否開啟。');
        console.error(err);
      },
    });
  }
}
