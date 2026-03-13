import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/inventory-list/inventory-list.component').then(m => m.InventoryListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/inventory-form/inventory-form.component').then(m => m.InventoryFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/inventory-form/inventory-form.component').then(m => m.InventoryFormComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/inventory-detail/inventory-detail.component').then(m => m.InventoryDetailComponent)
  }
];
