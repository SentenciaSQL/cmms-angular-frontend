export interface Asset {
  id: number;
  siteId: number;
  siteName?: string;
  companyName?: string;
  categoryId?: number;
  categoryName?: string;
  code: string;
  name: string;
  description?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  installedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // métricas
  totalWorkOrders?: number;
  openWorkOrders?: number;
  lastMaintenanceDate?: string;
}

export interface AssetCreateRequest {
  siteId: number;
  categoryId?: number;
  code: string;
  name: string;
  description?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  installedAt?: string;
  isActive?: boolean;
}

export interface AssetFilterRequest {
  search?: string;
  siteId?: number;
  companyId?: number;
  categoryId?: number;
  manufacturer?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PaginatedAssets {
  content: Asset[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
