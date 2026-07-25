import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceStore } from '../../store/ecommerce.store';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent {
  
  // 1. Inject the store we just created
  readonly store = inject(EcommerceStore);

  // Unified bracelet category for all bracelet-related products
  categoryList = [
    { name: 'All', path: 'assets/images/slider1.jpg' },
    { name: 'Beaded Bracelets', path: 'assets/images/categories/simple_bracelets.jpg' },
    { name: 'Pendants', path: '/assets/images/products/tom_and__jerry_pendant.jpg' },
    { name: 'Tasbih', path: 'assets/images/categories/simple_bracelets.jpg' },
    { name: 'Anklets', path: 'assets/images/categories/anklets.jpg' },
    { name: 'Gajry', path: 'assets/images/categories/gajry.jpg' },
    { name: 'Phone Charms', path: 'assets/images/categories/phone_charms.jpg' },
    { name: 'Earrings', path: 'assets/images/categories/earrings.jpg' },
  ];

  onCategoryClick(event: Event, categoryName: string) {
    event.preventDefault(); // Prevents the page from jumping if you use <a href="#">
    
    // Tell the store to update the selected category!
    this.store.setCategory(categoryName);

    // Scroll the user down so they can see the updated products
    setTimeout(() => {
      document.getElementById('our-creations')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}