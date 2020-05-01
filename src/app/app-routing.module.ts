import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((auth) => auth.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}

/**
 * AuthModule:
 * this is how to load module component lazy loaded
 * and then we need to remove from app.module
 */
