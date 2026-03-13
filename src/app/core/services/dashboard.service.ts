import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardStats {
  // Work Orders
  totalWorkOrders: number;
  openWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  overdueWorkOrders: number;
  // Por prioridad
  urgentWorkOrders: number;
  highPriorityWorkOrders: number;
  mediumPriorityWorkOrders: number;
  lowPriorityWorkOrders: number;
  // Assets
  totalAssets: number;
  activeAssets: number;
  assetsNeedingMaintenance: number;
  // Técnicos
  totalTechnicians: number;
  availableTechnicians: number;
  busyTechnicians: number;
  // Métricas
  avgCompletionTime: number | null;
  avgResponseTime: number | null;
  // Costos
  totalCostsThisMonth: number | null;
  totalCostsThisYear: number | null;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getStats(): Observable<DashboardStats> {
    return this.api.get<DashboardStats>('/dashboard/stats');
  }
}
