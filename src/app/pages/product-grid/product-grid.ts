import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EcommerceStore } from '../../store/ecommerce.store';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-grid.html',
  styleUrls: ['./product-grid.css']
})
export class ProductGridComponent {

  readonly store = inject(EcommerceStore);

  isInWishlist(productId: string): boolean {
    return this.store.wishlistItems().some((item) => item.id === productId);
  }

  toggleWishlist(productId: string): void {
    const product = this.store.products().find((item) => item.id === productId);
    if (!product) return;

    if (this.isInWishlist(productId)) {
      this.store.removeFromWishlist(productId);
      return;
    }

    this.store.addToWishlist(product);
  }
  toggleCartItem(productId: string): void {
    if (this.isProductInCart(productId)) {
      this.store.removeFromCart(productId);
      return;
    }

    const product = this.store.products().find((item) => item.id === productId);
    if (!product) return;
    this.store.addToCart(product);
  }

  isProductInCart(productId: string): boolean {
    return this.store.cartItems().some((item) => item.id === productId);
  }
  // Add this property to your component class
  showAllProducts = false;

  // Getter that returns either 20 items or all items based on the flag
  get visibleProducts() {
    const products = this.store.filteredProducts();
    return this.showAllProducts ? products : products.slice(0, 12);
  }

  // Toggle function
  toggleViewAll() {
    this.showAllProducts = !this.showAllProducts;
  }
}