import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #D3A555;">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/" style="color: #FEFEFE; font-size: 1.5rem;">
          Catmon
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            @if (isLoggedIn()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" style="color: #FEFEFE;">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/editor" routerLinkActive="active" style="color: #FEFEFE;">My Stories</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/play" routerLinkActive="active" style="color: #FEFEFE;">Play</a>
              </li>
            }
          </ul>
          <ul class="navbar-nav">
            @if (isLoggedIn()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/profile" style="color: #FEFEFE;">Profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" style="color: #FEFEFE; cursor: pointer;" (click)="logout()">Logout</a>
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active" style="color: #FEFEFE;">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/signup" routerLinkActive="active" style="color: #FEFEFE;">Sign Up</a>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  isLoggedIn = signal(false);

  constructor(private userService: UserService, private router: Router) {
    this.isLoggedIn.set(!!this.userService.getCurrentUser());
  }

  logout(): void {
    this.userService.logout();
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
