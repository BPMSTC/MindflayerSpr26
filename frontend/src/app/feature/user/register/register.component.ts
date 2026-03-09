import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../@core/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="text-center mb-4" style="color: #FEFEFE;">Join Catmon</h2>
              @if (errorMessage) {
                <div class="alert alert-danger">{{ errorMessage }}</div>
              }
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" formControlName="firstName"
                    [class.is-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" />
                  @if (registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched) {
                    <div class="invalid-feedback">First name is required.</div>
                  }
                </div>
                <div class="mb-3">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" formControlName="lastName"
                    [class.is-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" />
                  @if (registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched) {
                    <div class="invalid-feedback">Last name is required.</div>
                  }
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" formControlName="email"
                    [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" />
                  @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                    <div class="invalid-feedback">Email is required.</div>
                  }
                  @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                    <div class="invalid-feedback">Please enter a valid email address.</div>
                  }
                </div>
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input type="text" class="form-control" formControlName="username"
                    [class.is-invalid]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" />
                  @if (registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched) {
                    <div class="invalid-feedback">Username is required.</div>
                  }
                  @if (registerForm.get('username')?.hasError('minlength') && registerForm.get('username')?.touched) {
                    <div class="invalid-feedback">Username must be at least 3 characters.</div>
                  }
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" formControlName="password"
                    [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" />
                  @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                    <div class="invalid-feedback">Password is required.</div>
                  }
                  @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                    <div class="invalid-feedback">Password must be at least 6 characters.</div>
                  }
                </div>
                <button type="submit" class="btn w-100" style="background-color: #D3A555; color: #FEFEFE;" [disabled]="registerForm.invalid">
                  Sign Up
                </button>
              </form>
              <p class="text-center mt-3">
                Already have an account? <a routerLink="/login" style="color: #D3A555;">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.userService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.errorMessage = err.error?.message || 'Registration failed'
    });
  }
}
