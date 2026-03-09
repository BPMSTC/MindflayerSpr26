import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService, User } from '../../../@core/services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mt-5">
      <div class="text-center">
        <h1 style="color: #FEFEFE; font-size: 3rem;">Welcome to Catmon</h1>
        <p class="lead" style="color: #BCA591;">Choose Your Own Adventure Studio</p>
        @if (currentUser) {
          <p style="color: #FEFEFE;">Hello, {{ currentUser.firstName || currentUser.username }}!</p>
        }
        <div class="row mt-5 justify-content-center">
          <div class="col-md-4 mb-3">
            <div class="card shadow h-100" style="background-color: #BCA591;">
              <div class="card-body text-center">
                <h3 style="color: #FEFEFE;">Create</h3>
                <p style="color: #FEFEFE;">Build branching stories with the story editor</p>
                <a routerLink="/editor" class="btn" style="background-color: #D3A555; color: #FEFEFE;">My Stories</a>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card shadow h-100" style="background-color: #BCA591;">
              <div class="card-body text-center">
                <h3 style="color: #FEFEFE;">Play</h3>
                <p style="color: #FEFEFE;">Experience adventures created by others</p>
                <a routerLink="/play" class="btn" style="background-color: #D3A555; color: #FEFEFE;">Browse Stories</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background-color: #2a2a2a; min-height: calc(100vh - 120px); padding-bottom: 2rem; }
  `]
})
export class HomeComponent {
  currentUser: User | null;

  constructor(private userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();
  }
}
