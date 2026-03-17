// Import Angular routing module and our custom components
import { Routes } from '@angular/router';
// Import the catmon selection component (with .js extension for Angular compilation)
import { CatmonSelectComponent } from './feature/story-player/catmon-select/catmon-select.js';
// Import the home page component
import { HomeComponent } from './feature/user/home/home.js';

// Define the application routes - maps URLs to components
export const routes: Routes = [
  // Root path ('/') displays the HomeComponent (main page)
  { path: '', component: HomeComponent },
  // '/catmon-select' path displays the CatmonSelectComponent (catmon selection page)
  { path: 'catmon-select', component: CatmonSelectComponent },
  // Wildcard route - any unmatched URL redirects to the home page
  { path: '**', redirectTo: '' }
];
