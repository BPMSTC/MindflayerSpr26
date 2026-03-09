import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feature/user/user.routes').then(m => m.userRoutes)
  },
  {
    path: 'editor',
    loadChildren: () => import('./feature/story-editor/story-editor.routes').then(m => m.storyEditorRoutes)
  },
  {
    path: 'play',
    loadChildren: () => import('./feature/story-player/story-player.routes').then(m => m.storyPlayerRoutes)
  }
];
