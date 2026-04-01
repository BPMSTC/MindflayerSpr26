import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {} 
 