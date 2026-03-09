import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-header />
      <main class="flex-grow-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `
})
export class LayoutComponent {}
