import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoryService, Story } from '../../../@core/services/story.service';

@Component({
  selector: 'app-story-browse',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mt-4">
      <h2 style="color: #FEFEFE;" class="mb-4">Browse Adventures</h2>
      @if (stories.length === 0) {
        <div class="text-center mt-5">
          <p class="lead">No published stories yet. Check back later!</p>
        </div>
      }
      <div class="row">
        @for (story of stories; track story._id) {
          <div class="col-md-4 mb-3">
            <div class="card shadow h-100">
              @if (story.coverImage) {
                <img [src]="story.coverImage" class="card-img-top" [alt]="story.title" style="height: 200px; object-fit: cover;" />
              }
              <div class="card-body">
                <h5 class="card-title" style="color: #FEFEFE;">{{ story.title }}</h5>
                <p class="card-text">{{ story.description }}</p>
                <p class="text-muted small">By {{ story.author?.username || 'Unknown' }}</p>
              </div>
              <div class="card-footer">
                <a [routerLink]="['/play', story._id]" class="btn w-100" style="background-color: #D3A555; color: #FEFEFE;">
                  Play
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class StoryBrowseComponent implements OnInit {
  stories: Story[] = [];

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.storyService.getPublishedStories().subscribe(stories => this.stories = stories);
  }
}
