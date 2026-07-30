import { Component, signal, ViewChild, ElementRef, inject, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VoiceService } from '../../services/voice';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  type?: 'text' | 'catalog-link' | 'crystal-preview';
}

interface ChatSuccessResponse {
  reply?: string;
  text?: string;
}

interface ChatErrorResponse {
  error?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css'],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private voiceService = inject(VoiceService);

  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  isOpen = signal<boolean>(false);
  isTyping = signal<boolean>(false);
  userInput: string = '';

  autoSpeak = signal<boolean>(true);
  isListening = signal<boolean>(false);
  availableVoices = signal<string[]>([]);
  selectedVoiceName = signal<string>('');

  private subs = new Subscription();

  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Welcome to NextBloom! ✨ I am your guide. How can I help you with our custom creations today?', type: 'text' }
  ]);

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

  ngOnInit(): void {
    this.subs.add(
      this.voiceService.isListening$.subscribe((listening: boolean) => {
        this.isListening.set(listening);
      })
    );

    this.subs.add(
      this.voiceService.transcript$.subscribe((text: string) => {
        if (text) {
          this.userInput = text;
          this.sendMessage();
        }
      })
    );

    this.subs.add(
      this.voiceService.availableVoices$.subscribe((voices: string[]) => {
        this.availableVoices.set(voices);
      })
    );

    this.subs.add(
      this.voiceService.selectedVoiceName$.subscribe((voiceName: string) => {
        this.selectedVoiceName.set(voiceName);
      })
    );
  }

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  async sendMessage(): Promise<void> {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.update(msgs => [...msgs, { sender: 'user', text, type: 'text' }]);
    this.userInput = '';
    this.isTyping.set(true);

    try {
      const response = await fetch('https://nextbloom-backend.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        let apiError = `Chat API request failed with status ${response.status}`;
        try {
          const errData = await response.json() as ChatErrorResponse;
          apiError = errData.error ?? apiError;
        } catch {
          // Keep default error
        }
        throw new Error(apiError);
      }

      const data = await response.json() as ChatSuccessResponse;
      const botReply = data.reply ?? data.text;

      if (botReply) {
        this.messages.update(msgs => [...msgs, { sender: 'bot', text: botReply, type: 'text' }]);

        if (this.autoSpeak()) {
          this.voiceService.speak(botReply);
        }
      } else {
        this.messages.update(msgs => [...msgs, { sender: 'bot', text: 'Oops! Received empty response from AI.', type: 'text' }]);
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

  toggleSound(): void {
    this.autoSpeak.update(v => !v);
    if (!this.autoSpeak()) {
      this.voiceService.stopSpeaking();
    }
  }

  toggleListening(): void {
    if (this.isListening()) {
      this.voiceService.stopListening();
    } else {
      this.voiceService.startListening();
    }
  }

  onVoiceChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (!target?.value) {
      return;
    }

    this.voiceService.setPreferredVoiceByName(target.value);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.voiceService.stopSpeaking();
  }
}