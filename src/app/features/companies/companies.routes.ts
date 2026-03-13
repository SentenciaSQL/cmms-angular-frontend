import { Routes } from '@angular/router';

export const COMPANIES_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list',            loadComponent: () => import('./pages/companies-list/companies-list.component').then(m => m.CompaniesListComponent) },
  { path: 'create',          loadComponent: () => import('./pages/companies-form/companies-form.component').then(m => m.CompaniesFormComponent) },
  { path: 'edit/:id',        loadComponent: () => import('./pages/companies-form/companies-form.component').then(m => m.CompaniesFormComponent) },
  { path: 'detail/:id',      loadComponent: () => import('./pages/companies-detail/companies-detail.component').then(m => m.CompaniesDetailComponent) },
  { path: 'sites/create',    loadComponent: () => import('./pages/sites-form/sites-form.component').then(m => m.SitesFormComponent) },
  { path: 'sites/edit/:id',  loadComponent: () => import('./pages/sites-form/sites-form.component').then(m => m.SitesFormComponent) },
];
