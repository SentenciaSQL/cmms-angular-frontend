import {Supplier} from './supplier';

export interface InventoryItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  itemType: ItemType;
  supplier?: Supplier;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  unitCost?: number;
  location?: string;
  manufacturer?: string;
  partNumber?: string;
  imageUrl?: string;
  isActive: boolean;
  isLowStock: boolean;
  needsReorder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItemCreateRequest {
  code: string;
  name: string;
  description?: string;
  itemType: ItemType;
  supplierId?: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  unitCost?: number;
  location?: string;
  manufacturer?: string;
  partNumber?: string;
  imageUrl?: string;
}

export interface StockAdjustmentRequest {
  quantity: number;
  notes?: string;
}

export enum ItemType {
  SPARE_PART = 'SPARE_PART',
  TOOL = 'TOOL',
  CONSUMABLE = 'CONSUMABLE',
  MATERIAL = 'MATERIAL'
}
