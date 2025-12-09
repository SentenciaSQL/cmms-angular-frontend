import { Routes } from '@angular/router';

export const MAINTENANCE_PLANS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/plan-list/plan-list.component')
      .then(m => m.PlanListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/plan-form/plan-form.component')
      .then(m => m.PlanFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/plan-form/plan-form.component')
      .then(m => m.PlanFormComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/plan-detail/plan-detail.component')
      .then(m => m.PlanDetailComponent)
  }
];
