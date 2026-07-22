import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { Home } from '../home/home';
import { CategoriesComponent } from '../categories/categories';
import { ProductGridComponent } from '../product-grid/product-grid';
import { Footer } from '../../shared/footer/footer';
import { ChatbotComponent } from '../../shared/chatbot/chatbot';
import { PoliciesComponent } from '../policies/policies';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Header, Home, CategoriesComponent, ProductGridComponent, Footer, ChatbotComponent, PoliciesComponent],
  templateUrl: './landing.html'
})
export class LandingComponent {}
