import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { EcommerceStore } from '../../store/ecommerce.store';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [RouterLink, CurrencyPipe],
    templateUrl: './product-detail.html',
    styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent {
    
    // Inject the Store and Route
    readonly store = inject(EcommerceStore);
    private route = inject(ActivatedRoute);

    // Grab the ID from the URL exactly once when the component loads
    productId = this.route.snapshot.paramMap.get('id');

    // Dynamically compute the product. If the store updates, this updates!
    product = computed(() => 
        this.store.products().find(p => p.id === this.productId)
    );

    // Dynamically check if this specific item is in the wishlist
    isInWishlist = computed(() => {
        const currentProduct = this.product();
        if (!currentProduct) return false;
        // Assuming your store has a wishlistItems() signal!
        return this.store.wishlistItems?.().some((item: any) => item.id === currentProduct.id) || false;
    });

    // Action Methods
    addToCart() {
        const currentProduct = this.product();
        if (currentProduct) {
            this.store.addToCart(currentProduct);
        }
    }

    toggleWishlist() {
        const currentProduct = this.product();
        if (currentProduct) {
            if (this.isInWishlist()) {
                // Adjust method names based on exactly what you named them in your store
                this.store.removeFromWishlist?.(currentProduct.id); 
            } else {
                this.store.addToWishlist?.(currentProduct);
            }
        }
    }
}
