import { Routes } from '@angular/router';

export const ASSETS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/asset-list/asset-list.component').then(m => m.AssetListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/asset-form/asset-form.component').then(m => m.AssetFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/asset-form/asset-form.component').then(m => m.AssetFormComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/asset-detail/asset-detail.component').then(m => m.AssetDetailComponent)
  }
];
