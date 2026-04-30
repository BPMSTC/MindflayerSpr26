// Import necessary Angular modules
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // For navigation between pages
import { CommonModule } from '@angular/common'; // Provides *ngFor and other common directives

// Component decorator - defines this as an Angular component
@Component({
  selector: 'app-catmon-select', // HTML tag name for this component
  imports: [RouterLink, CommonModule], // Modules this component uses
  templateUrl: './catmon-select.html', // Path to the HTML template
  styleUrl: './catmon-select.css' // Path to the CSS styles
})
export class CatmonSelectComponent {
  // Array of catmon data - each object represents one catmon option
  // This data will be used to display the three selection cards
  catmons = [
    {
      name: 'NarMon', // Display name for the first catmon
      image: 'Catmon/NarMon/NarMon.png', // Path to the catmon image in the assets
      alt: 'Image of NarMon, a fierce, striped cat with bright red eyes, adorned with a golden ankh on its forehead. It is breaking golden chains with determination.', // Alt text for accessibility
      description: 'A clever and agile feline companion with keen intelligence.' // Description text
    },
    {
      name: 'KirMon', // Display name for the second catmon
      image: 'Catmon/KirMon/KirMon.png', // Path to the catmon image in the assets
      alt: 'Image of KirMon, a cute white cat in shiny silver armor leaps forward, showing fierce blue eyes. Clad in silver armor.', // Alt text for accessibility
      description: 'A strong and loyal warrior cat with a brave heart.' // Description text
    },
    {
      name: 'ShikaMon', // Display name for the third catmon
      image: 'Catmon/ShikaMon/ShikaMon.png', // Path to the catmon image in the assets
      alt: 'Image of ShikaMon, a fierce purple cat with glowing gold eyes, wrapped in black chains, lunging forward amid floating debris.', // Alt text for accessibility
      description: 'A mysterious and graceful cat with ancient wisdom.' // Description text
    } 
  ];
}