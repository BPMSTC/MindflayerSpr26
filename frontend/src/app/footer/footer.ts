import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  // Scrolls the viewport to the top of the page when a footer link is clicked,
  // ensuring the user sees the new content immediately.
  public scrollToStageTop() {
    // Wait until Angular finishes rendering the next stage in the DOM.
    requestAnimationFrame(() => {
      // Scroll to the top of the page.
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }
}

