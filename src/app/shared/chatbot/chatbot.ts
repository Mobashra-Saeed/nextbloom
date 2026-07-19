import { Component, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  type?: 'text' | 'catalog-link' | 'crystal-preview';
}

interface BotResponseConfig {
  reply: string;
  nextOptions: string[];
  type?: 'text' | 'catalog-link' | 'crystal-preview';
  action?: string;
}

// Our Advanced, Business-Specific Serverless Brain
const BOT_RESPONSES: Record<string, BotResponseConfig> = {
  'hello': {
    reply: 'Welcome to NextBloom! ✨ I am your fairy guide. Are you looking for custom beaded jewelry today?',
    nextOptions: ['Custom Creations', 'Sizing Guide', 'Shipping Info', 'Contact Artisan']
  },
  'Custom Creations': {
    reply: 'We hand-string beautiful bracelets, anklets, pendants, phone charms, tasbih counters, and gorgeous gajray! ✨ Best of all? Custom designs have ZERO extra charges. Want to explore our bead colors?',
    nextOptions: ['Color Magic Guide', 'View Full Catalog', 'Main Menu']
  },
  'Color Magic Guide': {
    reply: 'Every bead color carries its own special fairy dust. What aesthetic matches your soul?',
    nextOptions: ['Soft & Romantic', 'Earthy & Protective', 'Calm & Dreamy', 'Main Menu']
  },
  'Soft & Romantic': {
    reply: 'Our Soft Rose & Pearl beads are your perfect match. They look absolutely stunning woven into bracelets or traditional gajray.',
    type: 'crystal-preview',
    nextOptions: ['View Full Catalog', 'Main Menu']
  },
  'Earthy & Protective': {
    reply: 'Our Midnight Onyx beads are perfect for you. They create beautifully grounding tasbih counters and protective anklets.',
    type: 'crystal-preview',
    nextOptions: ['View Full Catalog', 'Main Menu']
  },
  'Calm & Dreamy': {
    reply: 'Our Ocean Glass beads will steal your heart. We love using these to craft ethereal phone charms and delicate pendants.',
    type: 'crystal-preview',
    nextOptions: ['View Full Catalog', 'Main Menu']
  },
  'Sizing Guide': {
    reply: 'We want your jewelry to fit perfectly! We offer 4 easy sizes: "Baby Size" (for little ones), "Slim Size" (for thinner wrists), "Regular Size" (for normal wrists), and "Large Size" (for broader or heavier wrists).',
    nextOptions: ['Custom Creations', 'Main Menu']
  },
  'Shipping Info': {
    reply: 'We deliver our enchanted parcels all across Pakistan! 🇵🇰 Delivery is just Rs. 350, and because each piece is handcrafted, it will safely arrive in 6-9 days.',
    nextOptions: ['Main Menu']
  },
  'Contact Artisan': {
    reply: 'We would love to hear from you! You can call or WhatsApp us directly at 0348-6527505, or tap the button below to chat with us right now.',
    type: 'catalog-link',
    nextOptions: ['Main Menu']
  },
  'View Full Catalog': {
    reply: 'Let me weave a portal straight to our interactive catalogs and WhatsApp support!',
    type: 'catalog-link',
    nextOptions: ['Explore Web Shop', 'Main Menu']
  },
  'Explore Web Shop': {
    reply: 'Transporting you to our digital treasure box...',
    nextOptions: ['Main Menu'], // <-- We added 'Main Menu' back here!
    action: 'NAVIGATE_PRODUCTS'
  },
  'Main Menu': {
    reply: 'What else can I help you discover today?',
    nextOptions: ['Custom Creations', 'Sizing Guide', 'Shipping Info', 'Contact Artisan']
  }
};

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent implements AfterViewChecked {
  private router = inject(Router);
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  isOpen = signal<boolean>(false);
  isTyping = signal<boolean>(false);

  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: BOT_RESPONSES['hello'].reply, type: 'text' }
  ]);

  currentOptions = signal<string[]>(BOT_RESPONSES['hello'].nextOptions);

  // Updated Bead & Crystal inventory for the UI preview
  crystalData = [
    { name: 'Soft Rose & Pearl', color: 'bg-[var(--brand-pink)]/40 border-[var(--brand-pink)]/60', energy: 'Perfect for Romantic Gajray & Bracelets' },
    { name: 'Midnight Onyx', color: 'bg-[var(--text-taupe)] border-[var(--text-taupe)] text-[var(--surface-white)]', energy: 'Ideal for Protective Anklets & Counters' },
    { name: 'Ocean Glass', color: 'bg-[var(--bg-slider)] border-[var(--bg-slider)]/70', energy: 'Dreamy Vibes for Phone Charms & Pendants' }
  ];

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  handleOptionClick(option: string): void {
    this.messages.update(msgs => [...msgs, { sender: 'user', text: option, type: 'text' }]);
    this.currentOptions.set([]);
    this.isTyping.set(true);

    setTimeout(() => {
      const response = BOT_RESPONSES[option] || BOT_RESPONSES['Main Menu'];

      this.messages.update(msgs => [...msgs, {
        sender: 'bot',
        text: response.reply,
        type: response.type || 'text'
      }]);

      this.isTyping.set(false);

      if (response.action === 'NAVIGATE_PRODUCTS') {
        setTimeout(() => {
          this.router.navigate(['/products']);
          this.isOpen.set(false);
        }, 1200);
      } else {
        this.currentOptions.set(response.nextOptions);
      }
    }, 900);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}