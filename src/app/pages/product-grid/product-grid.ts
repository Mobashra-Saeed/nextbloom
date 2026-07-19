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

  addProductToCart(productId: string): void {
    const product = this.store.products().find((item) => item.id === productId);
    if (product) {
      this.store.addToCart(product);
    }
  }

}