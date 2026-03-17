// Import necessary Angular modules
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // For navigation links in the template

// Component decorator - defines this as an Angular component
@Component({
  selector: 'app-home', // HTML tag name for this component
  imports: [RouterLink], // Modules this component uses
  templateUrl: './home.html', // Path to the HTML template
  styleUrl: './home.css' // Path to the CSS styles
})
export class HomeComponent {
  // Property that will be displayed in the template
  // Used in the hero section welcome message
  title = 'CatMon';
}