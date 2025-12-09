import {Asset} from './asset';

export interface MaintenancePlan {
  id: number;
  name: string;
  description: string;
  asset: Asset;
  type: 'PREVENTIVE' | 'PREDICTIVE' | 'CORRECTIVE';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  frequencyValue: number;
  nextScheduledDate: string;
  lastExecutionDate?: string;
  estimatedDurationMinutes: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  instructions: string;
  assignedTechnician?: any;
  isActive: boolean;
  autoGenerateWorkOrder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePlanCreateRequest {
  name: string;
  description?: string;
  assetId: number;
  type: 'PREVENTIVE' | 'PREDICTIVE' | 'CORRECTIVE';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  frequencyValue: number;
  nextScheduledDate?: string;
  estimatedDurationMinutes: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  instructions?: string;
  assignedTechnicianId?: number;
  autoGenerateWorkOrder?: boolean;
}
