import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../@core/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="text-center mb-4" style="color: #FEFEFE;">Login to Catmon</h2>
              @if (errorMessage) {
                <div class="alert alert-danger">{{ errorMessage }}</div>
              }
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input type="text" class="form-control" formControlName="username"
                    [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" />
                  @if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
                    <div class="invalid-feedback">Username is required.</div>
                  }
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" formControlName="password"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" />
                  @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                    <div class="invalid-feedback">Password is required.</div>
                  }
                </div>
                <button type="submit" class="btn w-100" style="background-color: #D3A555; color: #FEFEFE !important;" [disabled]="loginForm.invalid">
                  Login
                </button>
              </form>
              <p class="text-center mt-3" style="color: #FEFEFE;">
                Don't have an account? <a routerLink="/signup" style="color: #D3A555;">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.value;
    this.userService.authenticate(username, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.errorMessage = 'Invalid username or password'
    });
  }
}
