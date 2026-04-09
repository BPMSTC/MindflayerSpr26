import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    const result = this.auth.login(this.email, this.password);
    if (result.ok) {
      this.error.set(null);
      this.router.navigateByUrl('/');
    } else {
      this.error.set(result.message);
    }
  }
}
