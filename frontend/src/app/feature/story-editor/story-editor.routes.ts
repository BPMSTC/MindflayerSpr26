import { Routes } from '@angular/router';
import { LayoutComponent } from '../../@core/layout/layout/layout.component';
import { authGuard } from '../../@core/guards/auth.guard';

export const storyEditorRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./story-list/story-list.component').then(m => m.StoryListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./story-form/story-form.component').then(m => m.StoryFormComponent)
      },
      {
        path: 'edit/:story_id',
        loadComponent: () => import('./story-form/story-form.component').then(m => m.StoryFormComponent)
      },
      {
        path: 'nodes/:story_id',
        loadComponent: () => import('./node-editor/node-editor.component').then(m => m.NodeEditorComponent)
      }
    ]
  }
];
