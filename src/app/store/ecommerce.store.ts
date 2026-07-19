import { Injectable, computed, signal } from '@angular/core';

// 1. Define the Product Model
export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageURL: string;
    badge?: 'New' | 'Bestseller' | 'Sale' | '';
    category: string;
    inStock: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

// 2. Seed product data
const initialProducts: Product[] = [
    { id: '1', name: '2-Chain Name Bracelet (Black)', price: 500, imageURL: 'assets/images/products/2chain_name_bracelet_black.jpg', badge: 'Bestseller', category: 'pinterest Name Bracelets', inStock: true },
    { id: '2', name: '3-Chain Name Bracelet (Black)', price: 500, imageURL: 'assets/images/products/3chain_name_bracelet_black.jpg', category: 'pinterest Name Bracelets', inStock: true },
    { id: '3', name: '3-Chain Name Bracelet (Pink)', price: 500, imageURL: 'assets/images/products/3chain_name_bracelet_pink.jpg', badge: 'New', category: 'pinterest Name Bracelets', inStock: true },
    { id: '4', name: '3-Chain Name Bracelet (White)', price: 500, imageURL: 'assets/images/products/3chain_name_bracelet_white.jpg', category: 'pinterest Name Bracelets', inStock: true },
    { id: '5', name: '3-Chain Crystal Drop (Black)', price: 500, imageURL: 'assets/images/products/3chain_black.jpg', category: 'Simple Bracelets', inStock: true },
    { id: '6', name: '4-Chain Name Bracelet (Mehroon)', price: 500, imageURL: 'assets/images/products/4chain_name_bracelet_mehroon.jpg', category: 'pinterest Name Bracelets', inStock: true },
    { id: '7', name: '4-Chain Name Bracelet (Purple)', price: 500, imageURL: 'assets/images/products/4chain_name_bracelet_purple.jpg', category: 'pinterest Name Bracelets', inStock: true },
    { id: '8', name: '6-Chain Statement Bracelet (Black)', price: 500, imageURL: 'assets/images/products/6chain_black.jpg', badge: 'Bestseller', category: 'pinterest Name Bracelets', inStock: true },
    { id: '9', name: 'Delicate Bow Bracelet (Mehroon)', price: 500, imageURL: 'assets/images/products/bow_mehroon.jpg', category: 'Simple Bracelets', inStock: true },
    { id: '10', name: 'Bow Name Bracelet (Pink)', price: 500, originalPrice: 650, imageURL: 'assets/images/products/bow_name_bracelet_pink.jpg', badge: 'Sale', category: 'pinterest Name Bracelets', inStock: true },
    { id: '11', name: 'Classic Charm Name Bracelet', price: 500, imageURL: 'assets/images/products/charm_name_bracelet.jpg', category: 'pinterest Name Bracelets', inStock: true },
    { id: '12', name: 'Pakistan Edition Name Bracelet', price: 500, imageURL: 'assets/images/products/pakistan_name_bracelet.jpg', badge: 'New', category: 'pinterest Name Bracelets', inStock: true },
    { id: '13', name: 'Simple Beaded Bracelet (Pink)', price: 500, imageURL: 'assets/images/products/simple_pink.jpg', category: 'Simple Bracelets', inStock: true },
    { id: '14', name: 'Layered Pearl Stack (Pink)', price: 500, imageURL: 'assets/images/products/stack_pink.jpg', badge: 'Bestseller', category: 'Stack Bracelets', inStock: true },
    { id: '15', name: 'Star & Moon Rainbow Bracelet', price: 500, imageURL: 'assets/images/products/star_moon_rainbow.jpg', category: 'Simple Bracelets', inStock: true },
    { id: '16', name: 'Tulip Charm Bracelet (Pink)', price: 500, imageURL: 'assets/images/products/tulip_pink.jpg', category: 'Simple Bracelets', inStock: true },
];


@Injectable({ providedIn: 'root' })
export class EcommerceStore {
    // --- PRIVATE STATE SIGNALS ---
    private readonly productsState = signal<Product[]>(initialProducts);
    private readonly categoryState = signal<string>('all');

    // Brand new states for our Cart and Wishlist
    private readonly cartItemsState = signal<CartItem[]>([]);
    private readonly wishlistItemsState = signal<Product[]>([]);
    private readonly checkoutAccessState = signal<boolean>(false);

    // --- READONLY EXPOSURES ---
    // Preserve function-call API used by templates (e.g. store.category())
    readonly products = this.productsState.asReadonly();
    readonly category = this.categoryState.asReadonly();

    // Expose the new states so components can read them without altering them directly
    readonly cartItems = this.cartItemsState.asReadonly();
    readonly wishlistItems = this.wishlistItemsState.asReadonly();

    // --- COMPUTED SIGNALS ---
    readonly filteredProducts = computed(() => {
        const selectedCategory = this.category().trim().toLowerCase();
        if (!selectedCategory || selectedCategory === 'all') {
            return this.products();
        }
        return this.products().filter(
            (product) => product.category.trim().toLowerCase() === selectedCategory
        );
    });

    readonly cartItemsCount = computed(() =>
        this.cartItems().reduce((count, item) => count + item.quantity, 0)
    );

    readonly wishlistItemsCount = computed(() => this.wishlistItems().length);

    // --- ACTIONS / METHODS ---
    setCategory(category: string): void {
        this.categoryState.set(category);
    }

    addToCart(product: Product): void {
        this.cartItemsState.update((items) => {
            const existingItem = items.find((item) => item.id === product.id);
            if (existingItem) {
                return items.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            return [...items, { ...product, quantity: 1 }];
        });
    }

    increaseCartItemQuantity(productId: string): void {
        this.cartItemsState.update((items) =>
            items.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    }

    decreaseCartItemQuantity(productId: string): void {
        this.cartItemsState.update((items) =>
            items
                .map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    removeFromCart(productId: string): void {
        this.cartItemsState.update((items) => items.filter((item) => item.id !== productId));
    }

    addToWishlist(product: Product): void {
        this.wishlistItemsState.update((items) => {
            // Safety check: don't add it if it's already in the wishlist!
            const alreadyExists = items.some(p => p.id === product.id);
            if (alreadyExists) return items;

            return [...items, product];
        });
    }

    removeFromWishlist(productId: string): void {
        this.wishlistItemsState.update((items) =>
            // Keep everything EXCEPT the product with the matching ID
            items.filter(p => p.id !== productId)
        );
    }

    allowCheckoutAccess(): void {
        this.checkoutAccessState.set(true);
    }

    consumeCheckoutAccess(): boolean {
        const hasAccess = this.checkoutAccessState();
        this.checkoutAccessState.set(false);
        return hasAccess;
    }
}