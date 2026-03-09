import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StoryService, StoryNode, Story } from '../../../@core/services/story.service';

@Component({
  selector: 'app-node-editor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 style="color: #FEFEFE;">{{ story?.title }} - Nodes</h2>
        <a routerLink="/editor" class="btn btn-secondary">Back to Stories</a>
      </div>

      <!-- Node List -->
      <div class="row mb-4">
        @for (node of nodes; track node._id) {
          <div class="col-md-6 mb-3">
            <div class="card" [class.border-success]="story?.startNodeId === node._id" [class.border-warning]="node.isEnding">
              <div class="card-header d-flex justify-content-between">
                <strong>{{ node.title }}</strong>
                <div>
                  @if (story?.startNodeId === node._id) {
                    <span class="badge bg-success me-1">START</span>
                  }
                  @if (node.isEnding) {
                    <span class="badge bg-warning">ENDING</span>
                  }
                </div>
              </div>
              <div class="card-body">
                <p>{{ node.content }}</p>
                @if (node.choices.length > 0) {
                  <h6>Choices:</h6>
                  <ul class="list-group list-group-flush">
                    @for (choice of node.choices; track choice._id) {
                      <li class="list-group-item">{{ choice.text }}</li>
                    }
                  </ul>
                }
              </div>
              <div class="card-footer">
                <button class="btn btn-sm" style="background-color: #D3A555; color: #FEFEFE;" (click)="editNode(node)">Edit</button>
                <button class="btn btn-sm btn-danger ms-2" (click)="deleteNode(node._id!)">Delete</button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Node Form -->
      <div class="card shadow">
        <div class="card-header" style="background-color: #BCA591; color: #FEFEFE;">
          <h4>{{ editingNodeId ? 'Edit Node' : 'Add Node' }}</h4>
        </div>
        <div class="card-body">
          <form [formGroup]="nodeForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" formControlName="title" />
            </div>
            <div class="mb-3">
              <label class="form-label">Content</label>
              <textarea class="form-control" rows="4" formControlName="content"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Image URL</label>
              <input type="text" class="form-control" formControlName="imageUrl" />
            </div>
            <div class="form-check mb-3">
              <input type="checkbox" class="form-check-input" formControlName="isEnding" id="isEnding" />
              <label class="form-check-label" for="isEnding">This is an ending node</label>
            </div>

            <!-- Choices -->
            <h5>Choices</h5>
            @for (choice of choicesArray.controls; track $index; let i = $index) {
              <div class="input-group mb-2" [formGroupName]="i" formArrayName="choices">
                <input type="text" class="form-control" formControlName="text" placeholder="Choice text" />
                <select class="form-select" formControlName="nextNodeId" style="max-width: 200px;">
                  <option [value]="null">-- Link later --</option>
                  @for (n of nodes; track n._id) {
                    <option [value]="n._id">{{ n.title }}</option>
                  }
                </select>
                <button type="button" class="btn btn-danger" (click)="removeChoice(i)">X</button>
              </div>
            }
            <button type="button" class="btn btn-sm btn-outline-secondary mb-3" (click)="addChoice()">+ Add Choice</button>

            <div>
              <button type="submit" class="btn" style="background-color: #D3A555; color: #FEFEFE;" [disabled]="nodeForm.invalid">
                {{ editingNodeId ? 'Update Node' : 'Create Node' }}
              </button>
              @if (editingNodeId) {
                <button type="button" class="btn btn-secondary ms-2" (click)="cancelEdit()">Cancel</button>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class NodeEditorComponent implements OnInit {
  storyId!: string;
  story: Story | null = null;
  nodes: StoryNode[] = [];
  nodeForm: FormGroup;
  editingNodeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private storyService: StoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.nodeForm = this.createNodeForm();
  }

  get choicesArray(): FormArray {
    return this.nodeForm.get('choices') as FormArray;
  }

  ngOnInit(): void {
    this.storyId = this.route.snapshot.params['story_id'];
    this.loadData();
  }

  loadData(): void {
    this.storyService.getStoryById(this.storyId).subscribe(story => this.story = story);
    this.storyService.getNodesByStory(this.storyId).subscribe(nodes => this.nodes = nodes);
  }

  createNodeForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      content: [''],
      imageUrl: [''],
      isEnding: [false],
      choices: this.fb.array([])
    });
  }

  addChoice(): void {
    this.choicesArray.push(this.fb.group({ text: ['', Validators.required], nextNodeId: [null] }));
  }

  removeChoice(index: number): void {
    this.choicesArray.removeAt(index);
  }

  editNode(node: StoryNode): void {
    this.editingNodeId = node._id!;
    this.nodeForm.patchValue({ title: node.title, content: node.content, imageUrl: node.imageUrl, isEnding: node.isEnding });
    this.choicesArray.clear();
    node.choices.forEach(choice => {
      this.choicesArray.push(this.fb.group({ text: [choice.text, Validators.required], nextNodeId: [choice.nextNodeId] }));
    });
  }

  cancelEdit(): void {
    this.editingNodeId = null;
    this.nodeForm = this.createNodeForm();
  }

  deleteNode(nodeId: string): void {
    this.storyService.deleteNode(nodeId).subscribe(() => this.loadData());
  }

  onSubmit(): void {
    if (this.nodeForm.invalid) return;
    const value = this.nodeForm.value;

    if (this.editingNodeId) {
      this.storyService.updateNode(this.editingNodeId, value).subscribe(() => {
        this.cancelEdit();
        this.loadData();
      });
    } else {
      this.storyService.createNode(this.storyId, value).subscribe(() => {
        this.nodeForm = this.createNodeForm();
        this.loadData();
      });
    }
  }
}
