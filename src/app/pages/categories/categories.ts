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

  // Your existing category list
  categoryList = [
    { name: 'All', path: 'assets/images/slider1.jpg' },
    { name: 'pinterest Name Bracelets', path: 'assets/images/categories/pinterest_name_bracelets.jpg' },
    { name: 'Simple Bracelets', path: 'assets/images/categories/simple_bracelets.jpg' },
    { name: 'Stack Bracelets', path: 'assets/images/categories/stack.jpg' },
    { name: 'Simple Name Bracelets', path: 'assets/images/categories/simple_name_bracelets.jpg' },
    { name: 'Anklets', path: 'assets/images/categories/anklets.jpg' },
    { name: 'Gajry', path: 'assets/images/categories/gajry.jpg' },
    { name: 'Phone Charms', path: 'assets/images/categories/phone_charms.jpg' },
    { name: 'Earrings', path: 'assets/images/categories/earrings.jpg' },
    { name: 'Pair Bracelets', path: 'assets/images/categories/pair_bracelets.jpg' },
    // ... rest of your categories
  ];

  // 2. Create a method to handle the click
  onCategoryClick(event: Event, categoryName: string) {
    event.preventDefault(); // Prevents the page from jumping if you use <a href="#">
    
    // Tell the store to update the selected category!
    this.store.setCategory(categoryName);
  }
}