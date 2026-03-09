import { Routes } from '@angular/router';
import { LayoutComponent } from '../../@core/layout/layout/layout.component';
import { authGuard } from '../../@core/guards/auth.guard';

export const userRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  }
];
