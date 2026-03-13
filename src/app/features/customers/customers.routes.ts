import { Routes } from '@angular/router';

export const CUSTOMERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list',       loadComponent: () => import('./pages/customers-list/customers-list.component').then(m => m.CustomersListComponent) },
  { path: 'create',     loadComponent: () => import('./pages/customers-form/customers-form.component').then(m => m.CustomersFormComponent) },
  { path: 'edit/:id',   loadComponent: () => import('./pages/customers-form/customers-form.component').then(m => m.CustomersFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./pages/customers-detail/customers-detail.component').then(m => m.CustomersDetailComponent) }
];
