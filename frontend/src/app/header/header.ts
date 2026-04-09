import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../feature/auth/auth.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  readonly auth = inject(AuthService);

  signIn(): void {
    this.router.navigateByUrl('/login');
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
