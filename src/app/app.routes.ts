import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'work-orders',
        loadChildren: () => import('./features/work-orders/work-orders.routes').then(m => m.WORK_ORDERS_ROUTES)
      },
      {
        path: 'assets',
        loadChildren: () => import('./features/assets/assets.routes').then(m => m.ASSETS_ROUTES)
      },
      {
        path: 'maintenance-plans',
        loadChildren: () => import('./features/maintenance-plans/maintenance-plans.routes').then(m => m.MAINTENANCE_PLANS_ROUTES)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES)
      },
      {
        path: 'personnel',
        loadChildren: () => import('./features/personnel/personnel.routes').then(m => m.PERSONNEL_ROUTES)
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customers/customers.routes').then(m => m.CUSTOMERS_ROUTES)
      },
      {
        path: 'companies-sites',
        loadChildren: () => import('./features/companies/companies.routes').then(m => m.COMPANIES_ROUTES)
      },
      {
        path: 'suppliers',
        loadChildren: () => import('./features/suppliers/suppliers.routes').then(m => m.SUPPLIERS_ROUTES)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }

    ]
  },

  {
    path: '**',
    redirectTo: '/dashboard'
  }

];
