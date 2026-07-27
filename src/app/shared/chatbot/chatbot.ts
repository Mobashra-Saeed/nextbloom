import { Component, signal, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  type?: 'text' | 'catalog-link' | 'crystal-preview';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css'],
})
export class ChatbotComponent {
  private router = inject(Router);
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  isOpen = signal<boolean>(false);
  isTyping = signal<boolean>(false);
  userInput: string = ''; 

  // Clean, simple initial greeting
  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Welcome to NextBloom! ✨ I am your guide. How can I help you with our custom creations today?', type: 'text' }
  ]);

  // Kept your crystal data just in case you want to trigger it from the AI later!
  crystalData = [
    { name: 'Soft Rose & Pearl', color: 'bg-[var(--brand-pink)]/40 border-[var(--brand-pink)]/60', energy: 'Perfect for Romantic Gajray & Bracelets' },
    { name: 'Midnight Onyx', color: 'bg-[var(--text-taupe)] border-[var(--text-taupe)] text-[var(--surface-white)]', energy: 'Ideal for Protective Anklets & Counters' },
    { name: 'Ocean Glass', color: 'bg-[var(--bg-slider)] border-[var(--bg-slider)]/70', energy: 'Dreamy Vibes for Phone Charms & Pendants' }
  ];

  constructor() {
    effect(() => {
      this.messages();
      this.isTyping();
      this.isOpen();

      setTimeout(() => {
        this.scrollToBottom();
      }, 50);
    });
  }

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  async sendMessage(): Promise<void> {
    const text = this.userInput.trim();
    if (!text) return;

    // 1. Add User Message
    this.messages.update(msgs => [...msgs, { sender: 'user', text, type: 'text' }]);
    this.userInput = ''; 
    this.isTyping.set(true);

    try {
      // 2. Fetch from backend via Angular dev proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        let apiError = `Chat API request failed with status ${response.status}`;
        try {
          const errData = await response.json();
          apiError = errData?.error || apiError;
        } catch {
          // Ignore JSON parse issues and keep fallback apiError message
        }
        throw new Error(apiError);
      }

      const data = await response.json();

      // 3. Display AI Response
      if (data.reply) {
        this.messages.update(msgs => [...msgs, { sender: 'bot', text: data.reply, type: 'text' }]);
      } else {
        this.messages.update(msgs => [...msgs, { sender: 'bot', text: "Oops! Error... Please try again.", type: 'text' }]);
      }

    } catch (error) {
      console.error('Chat API Error:', error);
      const errorText = error instanceof Error ? error.message : 'I am currently out of service.';
      this.messages.update(msgs => [...msgs, { sender: 'bot', text: errorText, type: 'text' }]);
    } finally {
      this.isTyping.set(false);
    }
  }

  private scrollToBottom(): void {
    if (this.chatScrollContainer?.nativeElement) {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    }
  }
}