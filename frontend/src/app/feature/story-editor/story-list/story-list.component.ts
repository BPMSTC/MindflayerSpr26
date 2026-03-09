import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoryService, Story } from '../../../@core/services/story.service';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 style="color: #FEFEFE;">My Stories</h2>
        <a routerLink="/editor/create" class="btn" style="background-color: #D3A555; color: #FEFEFE;">
          + New Story
        </a>
      </div>
      @if (stories.length === 0) {
        <div class="text-center mt-5">
          <p class="lead">No stories yet. Create your first adventure!</p>
        </div>
      }
      <div class="row">
        @for (story of stories; track story._id) {
          <div class="col-md-4 mb-3">
            <div class="card shadow h-100">
              <div class="card-body">
                <h5 class="card-title" style="color: #FEFEFE;">{{ story.title }}</h5>
                <p class="card-text">{{ story.description }}</p>
                <span class="badge" [style.background-color]="story.isPublished ? '#28a745' : '#6c757d'">
                  {{ story.isPublished ? 'Published' : 'Draft' }}
                </span>
              </div>
              <div class="card-footer">
                <a [routerLink]="['/editor/edit', story._id]" class="btn btn-sm" style="background-color: #D3A555; color: #FEFEFE;">
                  Edit
                </a>
                <a [routerLink]="['/editor/nodes', story._id]" class="btn btn-sm ms-2" style="background-color: #BCA591; color: #FEFEFE;">
                  Nodes
                </a>
                <button class="btn btn-sm btn-danger ms-2" (click)="deleteStory(story._id!)">Delete</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class StoryListComponent implements OnInit {
  stories: Story[] = [];

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.storyService.getMyStories().subscribe(stories => this.stories = stories);
  }

  deleteStory(id: string): void {
    this.storyService.deleteStory(id).subscribe(() => this.loadStories());
  }
}
