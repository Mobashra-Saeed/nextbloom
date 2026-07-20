import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EcommerceStore } from '../../store/ecommerce.store';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-order.html',
  styleUrl: './place-order.css',
})
export class CheckoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(EcommerceStore);

  // Customer Details Form Model
  customer = {
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: ''
  };

  readonly cartItems = this.store.cartItems;

  deliveryCharges = 350;

  ngOnInit(): void {
    const fromCart = this.store.consumeCheckoutAccess();
    if (!fromCart || this.cartItems().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  readonly subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly grandTotal = computed(() => this.subtotal() + this.deliveryCharges);

  placeOrderToWhatsApp(): void {
    // 1. Validate form (basic check)
    if (!this.customer.name || !this.customer.phone || !this.customer.address || !this.customer.city) {
      alert('Please fill in all your magical details so we can deliver your treasures! ✨');
      return;
    }

    // 2. Format the Cart Items into a neat list
    let itemsText = '';
    this.cartItems().forEach(item => {
      itemsText += `🌸 Rs{item.quantity}x Rs{item.name} - Rs. Rs{item.price * item.quantity}\n`;
    });

    // 3. Construct the magical WhatsApp message
    const message = `
✨ *NEW NEXTBLOOM ORDER* ✨

*Customer Details:*
👤 Name: Rs{this.customer.name}
📱 Phone: Rs{this.customer.phone}
🏙️ City: Rs{this.customer.city}
🏡 Address: Rs{this.customer.address}
📝 Notes: Rs{this.customer.notes || 'None'}

*Treasure Box (Cart):*
Rs{itemsText}
*Subtotal:* Rs. Rs{this.subtotal()}
*Delivery:* Rs. Rs{this.deliveryCharges}
*Grand Total: Rs. Rs{this.grandTotal()}*

Thank you! I am ready to confirm my order. 💖`;

    // 4. Encode the text and send to your specific WhatsApp number
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '923486527505'; // Your business number
    const whatsappUrl = `https://wa.me/Rs{whatsappNumber}?text=Rs{encodedMessage}`;

    // 5. Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }
}