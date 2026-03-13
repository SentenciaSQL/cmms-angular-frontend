import { Routes } from '@angular/router';

export const WORK_ORDERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/work-order-list/work-order-list.component')
        .then(m => m.WorkOrderListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/work-order-form/work-order-form.component')
        .then(m => m.WorkOrderFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/work-order-form/work-order-form.component')
        .then(m => m.WorkOrderFormComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/work-order-detail/work-order-detail.component')
        .then(m => m.WorkOrderDetailComponent)
  }
];
