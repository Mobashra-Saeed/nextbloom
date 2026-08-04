import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { EcommerceStore, Product } from '../../store/ecommerce.store';

interface ProductForm {
  name: string;
  price: number | null;
  originalPrice: number | null;
  imageURL: string;
  badge: 'New' | 'Bestseller' | 'Sale' | '';
  category: string;
  inStock: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {
  private readonly ADMIN_SESSION_KEY = 'nextbloom_admin_authenticated';
  readonly store = inject(EcommerceStore);

  passwordInput = '';
  loginError = '';
  actionMessage = '';
  readonly adminPanelPassword = environment.adminPanelPassword;

  isAuthenticated = sessionStorage.getItem(this.ADMIN_SESSION_KEY) === 'true';

  form: ProductForm = this.createEmptyForm();

  login(): void {
    this.loginError = '';

    if (this.passwordInput === this.adminPanelPassword) {
      this.isAuthenticated = true;
      sessionStorage.setItem(this.ADMIN_SESSION_KEY, 'true');
      this.passwordInput = '';
      return;
    }

    this.loginError = 'Incorrect password. Please try again.';
  }

  logout(): void {
    this.isAuthenticated = false;
    sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
    this.actionMessage = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.form.imageURL = reader.result;
      }
    };

    reader.readAsDataURL(file);
  }

  addProduct(): void {
    this.actionMessage = '';

    if (!this.form.name.trim() || !this.form.category.trim()) {
      this.actionMessage = 'Product name and category are required.';
      return;
    }

    if (this.form.price === null || this.form.price <= 0) {
      this.actionMessage = 'Price must be a valid number greater than 0.';
      return;
    }

    if (!this.form.imageURL.trim()) {
      this.actionMessage = 'Please provide an image URL or upload an image.';
      return;
    }

    this.store.addProduct({
      name: this.form.name.trim(),
      price: Number(this.form.price),
      originalPrice: this.form.originalPrice ? Number(this.form.originalPrice) : undefined,
      imageURL: this.form.imageURL.trim(),
      badge: this.form.badge,
      category: this.form.category.trim(),
      inStock: this.form.inStock
    });

    this.form = this.createEmptyForm();
    this.actionMessage = 'Product added successfully.';
  }

  deleteProduct(product: Product): void {
    const confirmed = window.confirm(`Delete "${product.name}" from catalog?`);
    if (!confirmed) {
      return;
    }

    this.store.removeProduct(product.id);
    this.actionMessage = 'Product deleted successfully.';
  }

  private createEmptyForm(): ProductForm {
    return {
      name: '',
      price: null,
      originalPrice: null,
      imageURL: '',
      badge: '',
      category: 'Beaded Bracelets',
      inStock: true
    };
  }
}
