export interface Supplier {
  id: number;
  name: string;
  code?: string;
  description?: string;
  email: string;
  phone?: string;
  mobile?: string;
  website?: string;
  taxId?: string;
  address?: Address;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  supplierType?: SupplierType;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreateRequest {
  name: string;
  code?: string;
  description?: string;
  email: string;
  phone?: string;
  mobile?: string;
  website?: string;
  taxId?: string;
  address?: AddressRequest;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  supplierType?: SupplierType;
  notes?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface AddressRequest {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export enum SupplierType {
  PARTS = 'PARTS',
  TOOLS = 'TOOLS',
  SERVICES = 'SERVICES',
  MATERIALS = 'MATERIALS',
  GENERAL = 'GENERAL'
}
