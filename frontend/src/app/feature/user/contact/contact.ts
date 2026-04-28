import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';
  submitted = signal(false);

  submit(): void {
    this.submitted.set(true);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
