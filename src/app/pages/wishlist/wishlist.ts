import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EcommerceStore, Product } from '../../store/ecommerce.store';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistComponent {
  readonly store = inject(EcommerceStore);
  readonly wishlistItems = this.store.wishlistItems;

  removeFromWishlist(id: string): void {
    this.store.removeFromWishlist(id);
  }

  moveToCart(item: Product): void {
    this.store.addToCart(item);
    this.removeFromWishlist(item.id);
  }

  wishlistDescription(item: Product): string {
    return `A handcrafted Rs{item.category.toLowerCase()} piece curated for your wishlist.`;
  }
}