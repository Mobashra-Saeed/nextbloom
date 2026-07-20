import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFoundComponent {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }

  openFairyChat(): void {
    this.router.navigate(['/']).then(() => {
      // Logic to pop open your fairy chat drawer automatically
    });
  }
}