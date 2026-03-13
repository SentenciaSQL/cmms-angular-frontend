export interface Technician {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userPhone?: string;
  skillLevel?: string;
  hourlyRate?: number;
  phoneAlt?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Métricas
  assignedWorkOrders?: number;
  completedWorkOrders?: number;
  totalHoursWorked?: number;
}

export interface TechnicianCreateRequest {
  userId: number;
  skillLevel?: string;
  hourlyRate?: number;
  phoneAlt?: string;
  notes?: string;
  isActive?: boolean;
}

export const SKILL_LEVELS = [
  { value: 'junior',  label: 'Junior' },
  { value: 'semi',    label: 'Semi-Senior' },
  { value: 'senior',  label: 'Senior' }
];
