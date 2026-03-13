import { Routes } from '@angular/router';

export const SUPPLIERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list',       loadComponent: () => import('./pages/suppliers-list/suppliers-list.component').then(m => m.SuppliersListComponent) },
  { path: 'create',     loadComponent: () => import('./pages/suppliers-form/suppliers-form.component').then(m => m.SuppliersFormComponent) },
  { path: 'edit/:id',   loadComponent: () => import('./pages/suppliers-form/suppliers-form.component').then(m => m.SuppliersFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./pages/suppliers-detail/suppliers-detail.component').then(m => m.SuppliersDetailComponent) }
];
