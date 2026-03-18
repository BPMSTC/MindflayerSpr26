// Import Angular routing module and our custom components
import { Routes } from '@angular/router';
// Import the catmon selection component (with .js extension for Angular compilation)
import { CatmonSelectComponent } from './feature/story-player/catmon-select/catmon-select.js';
// Import the NarMon adventure component
import { NarmonAdventureComponent } from './feature/story-player/narmon-adventure/narmon-adventure.js';
// Import the home page component
import { HomeComponent } from './feature/user/home/home.js';

// Define the application routes - maps URLs to components
export const routes: Routes = [
  // Root path ('/') displays the HomeComponent (main page)
  { path: '', component: HomeComponent },
  // '/catmon-select' path displays the CatmonSelectComponent (catmon selection page)
  { path: 'catmon-select', component: CatmonSelectComponent },
  // '/narmon-adventure' path displays the NarMon choose your own adventure
  { path: 'narmon-adventure', component: NarmonAdventureComponent },
  // Wildcard route - any unmatched URL redirects to the home page
  { path: '**', redirectTo: '' }
];
