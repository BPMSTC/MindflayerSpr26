import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from '../../../@core/services/story.service';

@Component({
  selector: 'app-story-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2 style="color: #FEFEFE;">{{ isEdit ? 'Edit Story' : 'Create Story' }}</h2>
      <form [formGroup]="storyForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" formControlName="title" />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" rows="3" formControlName="description"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Cover Image URL</label>
          <input type="text" class="form-control" formControlName="coverImage" />
        </div>
        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" formControlName="isPublished" id="isPublished" />
          <label class="form-check-label" for="isPublished">Published</label>
        </div>
        <button type="submit" class="btn" style="background-color: #D3A555; color: #FEFEFE;" [disabled]="storyForm.invalid">
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
        <button type="button" class="btn btn-secondary ms-2" (click)="cancel()">Cancel</button>
      </form>
    </div>
  `
})
export class StoryFormComponent implements OnInit {
  storyForm: FormGroup;
  isEdit = false;
  storyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private storyService: StoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      coverImage: [''],
      isPublished: [false]
    });
  }

  ngOnInit(): void {
    this.storyId = this.route.snapshot.params['story_id'] || null;
    if (this.storyId) {
      this.isEdit = true;
      this.storyService.getStoryById(this.storyId).subscribe(story => {
        this.storyForm.patchValue(story);
      });
    }
  }

  onSubmit(): void {
    if (this.storyForm.invalid) return;

    if (this.isEdit && this.storyId) {
      this.storyService.updateStory(this.storyId, this.storyForm.value).subscribe({
        next: () => this.router.navigate(['/editor'])
      });
    } else {
      this.storyService.createStory(this.storyForm.value).subscribe({
        next: () => this.router.navigate(['/editor'])
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/editor']);
  }
}
