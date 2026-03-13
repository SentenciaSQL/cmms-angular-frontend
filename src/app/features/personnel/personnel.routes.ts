import { Routes } from '@angular/router';

export const PERSONNEL_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/personnel-list/personnel-list.component').then(m => m.PersonnelListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/personnel-form/personnel-form.component').then(m => m.PersonnelFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/personnel-form/personnel-form.component').then(m => m.PersonnelFormComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/personnel-detail/personnel-detail.component').then(m => m.PersonnelDetailComponent)
  }
];
