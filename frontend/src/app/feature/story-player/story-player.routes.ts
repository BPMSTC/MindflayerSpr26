import { Routes } from '@angular/router';
import { LayoutComponent } from '../../@core/layout/layout/layout.component';

export const storyPlayerRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./story-browse/story-browse.component').then(m => m.StoryBrowseComponent)
      },
      {
        path: ':story_id',
        loadComponent: () => import('./story-play/story-play.component').then(m => m.StoryPlayComponent)
      }
    ]
  }
];
