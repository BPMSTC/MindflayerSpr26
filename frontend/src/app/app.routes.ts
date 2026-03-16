import { Routes } from '@angular/router';
// import { HomeComponent } from './feature/user/home/home.component';

// import { Home } from '';
// import { CatDex } from '';
// import { User } from '';

export const routes: Routes = [
//  {path: 'Home', component: DEFINE COMPONENT}, // Home
//  {path: 'CatDex', component: DEFINE COMPONENT}, // CatDex
//  {path: 'User', component: DEFINE COMPONENT}, // User
  {path: '', redirectTo: 'Home', pathMatch: 'full'} // Redirects empty path to Home
];
