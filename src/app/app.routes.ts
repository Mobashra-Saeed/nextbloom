import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/landing/landing').then(m => m.LandingComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent)
    },
    {
        path: 'wishlist',
        loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.WishlistComponent)
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-detail/product-detail')
            .then(m => m.ProductDetailComponent)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./pages/place-order/place-order')
            .then(m => m.CheckoutComponent)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
    
];
