// Import Angular routing module and our custom components
import { Routes } from '@angular/router';
// Import the catmon selection component (with .js extension for Angular compilation)
import { CatmonSelectComponent } from './feature/story-player/catmon-select/catmon-select.js';
// Import the adventure components
import { NarmonAdventureComponent } from './feature/story-player/narmon-adventure/narmon-adventure.js';
import { KirmonAdventureComponent } from './feature/story-player/kirmon-adventure/kirmon-adventure.js';
import { ShikamonAdventureComponent } from './feature/story-player/shikamon-adventure/shikamon-adventure.js';
// Import the home page component
import { HomeComponent } from './feature/user/home/home.js';
// Auth components
import { LoginComponent } from './feature/auth/login/login.js';
import { SignupComponent } from './feature/auth/signup/signup.js';
import { CatdexComponent } from './feature/catdex/catdex.js';

// Define the application routes - maps URLs to components
export const routes: Routes = [
  // Root path ('/') displays the HomeComponent (main page)
  { path: '', component: HomeComponent },
  // '/catmon-select' path displays the CatmonSelectComponent (catmon selection page)
  { path: 'catmon-select', component: CatmonSelectComponent },
  // Adventure routes for each CatMon
  { path: 'narmon-adventure', component: NarmonAdventureComponent },
  { path: 'kirmon-adventure', component: KirmonAdventureComponent },
  { path: 'shikamon-adventure', component: ShikamonAdventureComponent },
  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'catdex', component: CatdexComponent },
  // Wildcard route - any unmatched URL redirects to the home page
  { path: '**', redirectTo: '' }
];
