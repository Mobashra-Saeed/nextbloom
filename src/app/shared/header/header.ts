import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EcommerceStore } from '../../store/ecommerce.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly store = inject(EcommerceStore);
}
