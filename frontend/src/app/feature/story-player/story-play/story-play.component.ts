import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StoryService, Story, StoryNode } from '../../../@core/services/story.service';

@Component({
  selector: 'app-story-play',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mt-4">
      @if (!story) {
        <p>Loading...</p>
      } @else if (!currentNode) {
        <div class="text-center mt-5">
          <h2 style="color: #FEFEFE;">{{ story.title }}</h2>
          <p>This story has no nodes yet.</p>
          <a routerLink="/play" class="btn btn-secondary">Back to Stories</a>
        </div>
      } @else {
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card shadow">
              @if (currentNode.imageUrl) {
                <img [src]="currentNode.imageUrl" class="card-img-top" [alt]="currentNode.title" style="max-height: 400px; object-fit: cover;" />
              }
              <div class="card-body">
                <h3 style="color: #FEFEFE;">{{ currentNode.title }}</h3>
                <p class="lead">{{ currentNode.content }}</p>

                @if (currentNode.isEnding) {
                  <div class="text-center mt-4">
                    <h4 style="color: #D3A555;">The End</h4>
                    <button class="btn me-2" style="background-color: #D3A555; color: #FEFEFE;" (click)="restart()">Play Again</button>
                    <a routerLink="/play" class="btn btn-secondary">Browse More</a>
                  </div>
                } @else {
                  <h5 class="mt-4">What do you do?</h5>
                  <div class="d-grid gap-2 mt-3">
                    @for (choice of currentNode.choices; track choice._id) {
                      <button
                        class="btn btn-lg text-start"
                        style="background-color: #BCA591; color: #FEFEFE; border: 2px solid #D3A555;"
                        (click)="makeChoice(choice.nextNodeId)"
                        [disabled]="!choice.nextNodeId">
                        {{ choice.text }}
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: calc(100vh - 120px); padding-bottom: 2rem; }
  `]
})
export class StoryPlayComponent implements OnInit {
  story: Story | null = null;
  currentNode: StoryNode | null = null;
  storyId!: string;

  constructor(
    private storyService: StoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storyId = this.route.snapshot.params['story_id'];
    this.storyService.getStoryById(this.storyId).subscribe(story => {
      this.story = story;
      if (story.startNodeId) {
        this.loadNode(story.startNodeId);
      }
    });
  }

  loadNode(nodeId: string): void {
    this.storyService.getNodeById(nodeId).subscribe(node => this.currentNode = node);
  }

  makeChoice(nextNodeId: string | null): void {
    if (nextNodeId) {
      this.loadNode(nextNodeId);
    }
  }

  restart(): void {
    if (this.story?.startNodeId) {
      this.loadNode(this.story.startNodeId);
    }
  }
}
