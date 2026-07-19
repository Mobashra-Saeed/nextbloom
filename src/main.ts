import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- Fix the import name and path here

bootstrapApplication(AppComponent, appConfig) // <-- Ensure it bootstraps AppComponent
  .catch((err) => console.error(err));