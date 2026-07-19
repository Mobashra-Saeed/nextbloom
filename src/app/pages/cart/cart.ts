import { Component, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartItem, EcommerceStore } from '../../store/ecommerce.store';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent {
  readonly store = inject(EcommerceStore);
  private readonly router = inject(Router);
  readonly cartItems = this.store.cartItems;

  // Computed Values (Automatically recalculate whenever cartItems updates)
  totalItemsCount = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  cartSubtotal = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  estimatedTax = computed(() => 
    this.cartSubtotal() * 0.05 // A softer 5% luxury fairy tax
  );

  orderTotal = computed(() => 
    this.cartSubtotal() + this.estimatedTax()
  );

  // Cart Actions
  increaseQty(item: CartItem): void {
    this.store.increaseCartItemQuantity(item.id);
  }

  decreaseQty(item: CartItem): void {
    this.store.decreaseCartItemQuantity(item.id);
  }

  removeItem(id: string): void {
    this.store.removeFromCart(id);
  }

  proceedToCheckout(): void {
    this.store.allowCheckoutAccess();
    this.router.navigate(['/checkout']);
  }
}