import { Injectable, computed, signal, effect } from '@angular/core';

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
    { id: '1', name: '2-Chain Butterfly Name Bracelet (Black)', price: 350, imageURL: 'assets/images/products/2chain_butterfly_name_bracelet_black.jpg', badge: 'Bestseller', category: 'Beaded Bracelets', inStock: true },
    { id: '2', name: '3-Chain Name Bracelet (Black)', price: 350, imageURL: 'assets/images/products/3chain_name_bracelet_black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '3', name: '2-Chain Butterfly Name Bracelet (Pink)', price: 350, imageURL: 'assets/images/products/2chain_butterfly_name_bracelet_pink.jpg', badge: 'New', category: 'Beaded Bracelets', inStock: true },
    { id: '4', name: '2-Chain Butterfly Name Bracelet (White)', price: 350, imageURL: 'assets/images/products/2chain_butterfly_name_bracelet_white.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '5', name: '3-Chain Crystal Drop (Black)', price: 350, imageURL: 'assets/images/products/3chain_black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '6', name: '4-Chain Name Bracelet (Mehroon)', price: 350, imageURL: 'assets/images/products/4chain_name_bracelet_mehroon.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '7', name: '4-Chain Name Bracelet (Purple)', price: 350, imageURL: 'assets/images/products/4chain_name_bracelet_purple.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '8', name: '6-Chain Statement Bracelet (Black)', price: 450, imageURL: 'assets/images/products/6chain_black.jpg', badge: 'Bestseller', category: 'Beaded Bracelets', inStock: true },
    { id: '9', name: 'Delicate Bow Bracelet (Mehroon)', price: 350, imageURL: 'assets/images/products/bow_mehroon.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '10', name: 'Bow Name Bracelet (Pink)', price: 350, originalPrice: 650, imageURL: 'assets/images/products/bow_name_bracelet_pink.jpg', badge: 'Sale', category: 'Beaded Bracelets', inStock: true },
    { id: '11', name: 'Classic Charm Name Bracelet', price: 280, imageURL: 'assets/images/products/charm_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '12', name: 'Pakistan Edition Name Bracelet', price: 350, imageURL: 'assets/images/products/pakistan_name_bracelet.jpg', badge: 'New', category: 'Beaded Bracelets', inStock: true },
    { id: '13', name: 'Simple Beaded Bracelet (Pink)', price: 220, imageURL: 'assets/images/products/simple_pink.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '14', name: 'Layered Pearl Stack (Pink)', price: 690, imageURL: 'assets/images/products/stack_pink.jpg', badge: 'Bestseller', category: 'Beaded Bracelets', inStock: true },
    { id: '15', name: 'Star & Moon Rainbow Bracelet', price: 350, imageURL: 'assets/images/products/star_moon_rainbow.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '16', name: 'Tulip Charm Bracelet (Pink)', price: 450, imageURL: 'assets/images/products/tulip_pink.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '17', name: 'Everyday Anklet', price: 250, imageURL: 'assets/images/products/anklets.jpg', category: 'Anklets', inStock: true },
    { id: '19', name: 'Floral Gajry', price: 800, imageURL: 'assets/images/products/gajry.jpg', category: 'Gajry', inStock: true },
    { id: '20', name: 'Jumka Earrings', price: 300, imageURL: 'assets/images/products/jumka.jpg', category: 'Earrings', inStock: true },
    { id: '21', name: 'Name Bracelet Classic', price: 220, imageURL: 'assets/images/products/name_bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '22', name: 'Pair Bracelet Set (Mehroon)', price: 750, imageURL: 'assets/images/products/pair_bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '23', name: 'Pair Bracelet (Tom and Jerry)', price: 750, imageURL: 'assets/images/products/Pair_Tom_and_jerry.jpeg', badge: 'New', category: 'Beaded Bracelets', inStock: true },
    { id: '25', name: 'Pinterest Name Bracelet Edition', price: 500, imageURL: 'assets/images/products/pinterest_name_bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '26', name: 'Simple Bracelet (Classic)', price: 220, imageURL: 'assets/images/products/simple bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '27', name: 'Simple Bracelet (Signature)', price: 150, imageURL: 'assets/images/products/simple_bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '28', name: 'Simple Name Bracelet', price: 220, imageURL: 'assets/images/products/simple_name_bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '29', name: 'Stack Bracelet (Classic)', price: 500, imageURL: 'assets/images/products/stack.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '30', name: 'Tasbih Bracelet', price: 370, imageURL: 'assets/images/products/tasbih.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '31', name: 'Pinterest Independence Day Name Bracelet', price: 450, imageURL: 'assets/images/products/_pinterest_independnce_day_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '32', name: '2-Chains Name Beaded (Pink)', price: 320, imageURL: 'assets/images/products/2chains_name_baby_pink_beaded.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '33', name: '2-Chains Name (Black)', price: 350, imageURL: 'assets/images/products/2chains_name_black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '34', name: '2-Chains Name Beaded (Black)', price: 320, imageURL: 'assets/images/products/2chains_name_black_beaded.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '35', name: '2-Chains Name Beaded (Mehroon)', price: 320, imageURL: 'assets/images/products/2chains_name_mehroon_beaded.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '36', name: '2-Chains Name (Pink)', price: 320, imageURL: 'assets/images/products/2chains_name_pink.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '37', name: '2-Chains Name Beaded (Pink)', price: 320, imageURL: 'assets/images/products/2chains_name_pink_beaded.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '38', name: '2-Chains Name Beaded (Purple)', price: 320, imageURL: 'assets/images/products/2chains_name_purple_beaded.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '39', name: '2-Chains Name Beaded (White)', price: 320, imageURL: 'assets/images/products/2chains_name_white_beaded.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '40', name: '2-Chains Butterfly Name (Purple)', price: 350, imageURL: 'assets/images/products/2chains_purple_butterfly_name.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '41', name: '3-Chain Name Bracelet (Bubblegum)', price: 350, imageURL: 'assets/images/products/3chain_bubblegum_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '42', name: '3-Chains Name Bracelet (Black)', price: 350, imageURL: 'assets/images/products/3chains_black_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '43', name: '3-Chains Name Bracelet (Mehroon)', price: 350, imageURL: 'assets/images/products/3chains_mehroon_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '44', name: '4-Chains Name (Purple)', price: 350, imageURL: 'assets/images/products/4chains_purple_name.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '45', name: 'Name Bracelet for Men (Black)', price: 220, imageURL: 'assets/images/products/black_name_bracelet_forMen.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '46', name: 'Name Bracelet Men (Black)', price: 220, imageURL: 'assets/images/products/black_name_bracelet_Men.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '47', name: 'Pair Name Bracelet (Black)', price: 750, imageURL: 'assets/images/products/black_pair_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '48', name: 'Black White Gajra', price: 750, imageURL: 'assets/images/products/black_white_gajra.jpg', category: 'Gajry', inStock: true },
    { id: '49', name: 'Butterfly Pendants', price: 250, imageURL: 'assets/images/products/butterfly_pendants.jpg', category: 'Pendants', inStock: true },
    { id: '50', name: 'Chained Name Bracelet', price: 350, imageURL: 'assets/images/products/chained_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    
    { id: '52', name: 'Chained Pair Bracelets', price: 750, imageURL: 'assets/images/products/Chained_Pair_Bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '53', name: 'Charm Independence Day Name Bracelet', price: 250, imageURL: 'assets/images/products/charm_independnce_day_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '54', name: 'Charm Name Bracelet (All Colors)', price: 250, imageURL: 'assets/images/products/charm_name_bracelet_allcolors.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '55', name: 'Charm Name Bracelet (Black)', price: 300, imageURL: 'assets/images/products/charm_name_bracelet_black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '56', name: 'Crysal Bracelets (Golden)', price: 250, imageURL: 'assets/images/products/crysal_Bracelets_Golden.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '57', name: 'Crystal (Black)', price: 250, imageURL: 'assets/images/products/crystal_black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '58', name: 'Fancy Independence Day Name Bracelet', price: 450, imageURL: 'assets/images/products/fancy_independnce_day_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '59', name: 'Flower Earrings', price: 300, imageURL: 'assets/images/products/flower_earrings.jpg', category: 'Earrings', inStock: true },
    { id: '60', name: 'Flower Earrings (Golden)', price: 300, imageURL: 'assets/images/products/flower_earrings_golden.jpg', category: 'Earrings', inStock: true },
    { id: '61', name: 'Four Chain Name Bracelet (Black)', price: 500, imageURL: 'assets/images/products/four_chain_name_bracelet_black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '62', name: 'Gajra Set', price: 500, imageURL: 'assets/images/products/Gajra_Set.jpg', category: 'Gajry', inStock: true },
    { id: '63', name: 'Sahary (Golden)', price: 700, imageURL: 'assets/images/products/golden_sahary.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '64', name: 'Stack (Golden)', price: 500, imageURL: 'assets/images/products/golden_stack.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '65', name: 'Letter Name Pendant', price: 250, imageURL: 'assets/images/products/letter_name_pendant.jpg', category: 'Pendants', inStock: true },
    { id: '66', name: 'Simple (Mehroon)', price: 220, imageURL: 'assets/images/products/mehroon_simple.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '67', name: 'Name Bracelet (Pink)', price: 220, imageURL: 'assets/images/products/name_bracelet_pink.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '68', name: 'Name Initial Pendant', price: 250, imageURL: 'assets/images/products/name_initial_pendant.jpg', category: 'Pendants', inStock: true },
    { id: '69', name: 'Pair Name Bracelets (Mehroon)', price: 750, imageURL: 'assets/images/products/pair_mehroon_name_bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '70', name: 'Phone Charm (Yellow)', price: 300, imageURL: 'assets/images/products/phone_charm_yellow.jpg', category: 'Phone Charms', inStock: true },
    { id: '71', name: 'Phone Charm (Pink)', price: 300, imageURL: 'assets/images/products/pink_phone_charm.jpg', category: 'Phone Charms', inStock: true },
    { id: '72', name: 'Purlple Tulip Earrings', price: 300, imageURL: 'assets/images/products/purlple_tulip_earrings.jpg', category: 'Earrings', inStock: true },
    { id: '73', name: 'Pair Name Bracelet (Purple)', price: 750, imageURL: 'assets/images/products/purple_pair_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '74', name: 'Simple Name Bracelet (Rainbow)', price: 250, imageURL: 'assets/images/products/rainbow_simple_name_bracelet.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '75', name: 'Simple Name (Blue)', price: 220, imageURL: 'assets/images/products/simple_name_blue.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '76', name: 'Simple Name (Golden)', price: 220, imageURL: 'assets/images/products/simple_name_golden.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '77', name: 'Simple Name (Orange)', price: 220, imageURL: 'assets/images/products/simple_name_orange.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '78', name: 'Simple Name (Purple)', price: 220, imageURL: 'assets/images/products/simple_name_purple.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '79', name: 'Simple Name With Silver Rings (Purple)', price: 250, imageURL: 'assets/images/products/simple_name_purple_with_silver_rings.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '80', name: 'Simple Name With Small Beads (Purple)', price: 220, imageURL: 'assets/images/products/simple_name_purple_with_small_beads.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '81', name: 'Simple Name (White)', price: 220, imageURL: 'assets/images/products/simple_name_white.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '82', name: 'Simple Name Crystal (White)', price: 220, imageURL: 'assets/images/products/simple_name_white_crystal.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '83', name: 'Simple Pair Bracelets', price: 600, imageURL: 'assets/images/products/simple_pair_bracelets.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '84', name: 'Simple Pair Bracelets Rings (Silver)', price: 250, imageURL: 'assets/images/products/simple_pair_bracelets_silver_rings.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '85', name: 'Stack (Black)', price: 500, imageURL: 'assets/images/products/stack_black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '86', name: 'Stack (White)', price: 2950, imageURL: 'assets/images/products/stack_white.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '87', name: 'Tasbih (Pink)', price: 370, imageURL: 'assets/images/products/tasbih_pink.jpg', category: 'Tasbih', inStock: true },
    { id: '88', name: 'Tom and Jerry Pendant', price: 500, imageURL: 'assets/images/products/tom_and__jerry_pendant.jpg', category: 'Pendants', inStock: true },
    { id: '89', name: 'Tulip (Black)', price: 450, imageURL: 'assets/images/products/Tulip_Black.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '90', name: 'Tulip (Orange)', price: 450, imageURL: 'assets/images/products/tulip_orange.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '91', name: 'Tulip (Purple)', price: 450, imageURL: 'assets/images/products/tulip_purple.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '92', name: 'Tulip (Sky)', price: 450, imageURL: 'assets/images/products/tulip_sky.jpg', category: 'Beaded Bracelets', inStock: true },
    { id: '93', name: 'Gajra (White)', price: 450, imageURL: 'assets/images/products/white_gajra.jpg', category: 'Gajry', inStock: true },
];

@Injectable({ providedIn: 'root' })
export class EcommerceStore {
    private readonly CART_KEY = 'nextbloom_cart';
    private readonly WISHLIST_KEY = 'nextbloom_wishlist';

    // --- PRIVATE STATE SIGNALS ---
    private readonly productsState = signal<Product[]>(initialProducts);
    private readonly categoryState = signal<string>('all');

    // Initialize states from localStorage if existing data is present
    private readonly cartItemsState = signal<CartItem[]>(
        this.loadFromStorage<CartItem[]>(this.CART_KEY, [])
    );
    private readonly wishlistItemsState = signal<Product[]>(
        this.loadFromStorage<Product[]>(this.WISHLIST_KEY, [])
    );
    private readonly checkoutAccessState = signal<boolean>(false);

    constructor() {
        // Automatically sync cart state to localStorage whenever it changes
        effect(() => {
            localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItemsState()));
        });

        // Automatically sync wishlist state to localStorage whenever it changes
        effect(() => {
            localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(this.wishlistItemsState()));
        });
    }

    // --- READONLY EXPOSURES ---
    readonly products = this.productsState.asReadonly();
    readonly category = this.categoryState.asReadonly();
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

    clearCart(): void {
        this.cartItemsState.set([]);
    }

    addToWishlist(product: Product): void {
        this.wishlistItemsState.update((items) => {
            const alreadyExists = items.some(p => p.id === product.id);
            if (alreadyExists) return items;

            return [...items, product];
        });
    }

    removeFromWishlist(productId: string): void {
        this.wishlistItemsState.update((items) =>
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

    // --- HELPER FUNCTION FOR STORAGE ---
    private loadFromStorage<T>(key: string, defaultValue: T): T {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return defaultValue;
        }
    }
}