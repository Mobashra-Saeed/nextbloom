
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. Define the TypeScript interface matching the API response object structure
interface JewelryItem {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

@Component({
  selector: 'app-jewelry-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jewelry-showcase.html'
})
export class JewelryShowcaseComponent implements OnInit {
  // Angular signals to hold our state
  jewelryList = signal<JewelryItem[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  async ngOnInit() {
    try {
      // Step 1: Fetch the jewelry array from the API
      const response = await fetch('https://fakestoreapi.com/products/category/jewelery');
      
      if (!response.ok) throw new Error('Failed to fetch data');

      // Step 2: Parse raw JSON into our typed array
      const data: JewelryItem[] = await response.json();

      // Step 3: Save data into our signal
      this.jewelryList.set(data);
    } catch (error) {
      console.error('Error loading jewelry:', error);
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}
