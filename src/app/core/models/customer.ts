export interface Customer {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userPhone?: string;
  companyId?: number;
  companyName?: string;
  position?: string;
  phoneAlt?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  requestedWorkOrders?: number;
}

export interface CustomerCreateRequest {
  userId: number;
  companyId?: number;
  position?: string;
  phoneAlt?: string;
  notes?: string;
  isActive?: boolean;
}
