import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html'
})
export class Home implements OnInit, OnDestroy {
  sliderImages: string[] = [
    'assets/images/slider2.jpg',
    'assets/images/slider3.jpg',
  ];

  currentIndex: number = 0;
  private slideTimer: any;

  // 1. Inject ChangeDetectorRef here
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.stopAutoSlide(); // Clear any existing timers just to be safe
    
    this.slideTimer = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.sliderImages.length;
      
      // 2. Force Angular to update the screen immediately
      this.cdr.detectChanges(); 
    }, 4000); 
  }

  stopAutoSlide(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
  }

  setSlide(index: number): void {
    this.currentIndex = index;
    this.cdr.detectChanges(); // Force update when a user clicks a dot
    this.startAutoSlide(); // Restart the timer so it doesn't instantly jump to the next one
  }
}