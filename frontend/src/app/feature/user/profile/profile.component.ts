import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService, User } from '../../../@core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2 style="color: #FEFEFE;">Profile</h2>
          @if (successMessage) {
            <div class="alert alert-success">{{ successMessage }}</div>
          }
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">First Name</label>
              <input type="text" class="form-control" formControlName="firstName" />
            </div>
            <div class="mb-3">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-control" formControlName="lastName" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" formControlName="email" />
            </div>
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" formControlName="username" [disabled]="true" />
            </div>
            <button type="submit" class="btn" style="background-color: #D3A555; color: #FEFEFE;">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  successMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: ['']
    });
  }

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue(user);
    }
  }

  onSubmit(): void {
    const user = this.userService.getCurrentUser();
    if (!user?._id) return;
    this.userService.updateUser(user._id, this.profileForm.value).subscribe({
      next: (updated) => {
        const current = this.userService.getCurrentUser();
        localStorage.setItem('currentUser', JSON.stringify({ ...current, ...updated }));
        this.successMessage = 'Profile updated!';
      }
    });
  }
}
