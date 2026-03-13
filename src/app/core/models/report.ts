export interface MonthlyReport {
  month: string;
  totalWorkOrders: number;
  completedWorkOrders: number;
  cancelledWorkOrders: number;
  workOrdersByPriority: Record<string, number>;
  workOrdersByTechnician: Record<string, number>;
  avgCompletionTime: number;
  avgResponseTime: number;
  totalCosts: number;
  totalLaborCosts: number;
  assetsServiced: number;
  mostServicedAssetId: number;
  mostServicedAssetName: string;
}

export interface TechnicianPerformance {
  technicianId: number;
  technicianName: string;
  totalWorkOrders: number;
  completedWorkOrders: number;
  openWorkOrders: number;
  overdueWorkOrders: number;
  avgCompletionTime?: number;
  totalHoursWorked?: number;
  completionRate?: number;
  onTimeRate?: number;
  totalRevenue?: number;
}

export interface AssetMaintenanceHistory {
  workOrderId: number;
  workOrderCode: string;
  title: string;
  status: string;
  technicianName: string;
  completedAt: string;
  actualHours: number;
  cost: number;
  description: string;
}
