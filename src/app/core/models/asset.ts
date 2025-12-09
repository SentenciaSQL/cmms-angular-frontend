export interface Asset {
  id: number;
  code: string;
  name: string;
  description?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  installedAt?: string;
  site?: Site;
  category?: AssetCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
}

interface Site {
  id: number;
  name: string;
  code?: string;
}

interface AssetCategory {
  id: number;
  name: string;
  code?: string;
}
