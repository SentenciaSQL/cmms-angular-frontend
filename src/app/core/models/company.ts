export interface Company {
  id: number;
  name: string;
  taxId?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalSites?: number;
  totalAssets?: number;
}

export interface CompanyCreateRequest {
  name: string;
  taxId?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

export interface Site {
  id: number;
  companyId: number;
  companyName?: string;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalAssets?: number;
  activeWorkOrders?: number;
}

export interface SiteCreateRequest {
  companyId: number;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive?: boolean;
}
