export interface WorkOrder {
  id: number;
  code: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  companyId?: number;
  companyName?: string;
  siteId?: number;
  siteName?: string;
  assetId?: number;
  assetName?: string;
  requesterId?: number;
  requesterName?: string;
  assignedTechnicianId?: number;
  technicianName?: string;
  dueDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByName?: string;
}

export enum WorkOrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum WorkOrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface WorkOrderCreateRequest {
  title: string;
  description?: string;
  priority: WorkOrderPriority;
  assetId?: number;
  siteId?: number;
  companyId?: number;
  assignedTechnicianId?: number;
  dueDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  estimatedHours?: number;
  notes?: string;
}

export interface WorkOrderStatusUpdateRequest {
  status: WorkOrderStatus;
  actualHours?: number;
  notes?: string;
}

export interface WorkOrderFilterRequest {
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  assetId?: number;
  technicianId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface PaginatedWorkOrders {
  content: WorkOrder[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
