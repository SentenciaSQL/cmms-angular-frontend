export type ItemType = 'SPARE_PART' | 'TOOL' | 'CONSUMABLE' | 'MATERIAL';
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';

export interface InventoryItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  itemType: ItemType;
  supplier?: { id: number; name: string };
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

export interface InventoryMovement {
  id: number;
  inventoryItem: InventoryItem;
  movementType: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  unitCost?: number;
  totalCost?: number;
  workOrder?: { id: number; code: string; title: string };
  user?: { id: number; username: string; firstName: string; lastName: string };
  notes?: string;
  referenceNumber?: string;
  movementDate: string;
  createdAt: string;
}

export interface InventoryMovementCreateRequest {
  inventoryItemId: number;
  movementType: MovementType;
  quantity: number;
  unitCost?: number;
  workOrderId?: number;
  notes?: string;
  referenceNumber?: string;
  movementDate?: string;
}

export const ITEM_TYPES: { value: ItemType; label: string; icon: string }[] = [
  { value: 'SPARE_PART',  label: 'Repuesto',    icon: '🔩' },
  { value: 'TOOL',        label: 'Herramienta', icon: '🔧' },
  { value: 'CONSUMABLE',  label: 'Consumible',  icon: '📦' },
  { value: 'MATERIAL',    label: 'Material',    icon: '🧱' }
];

export const MOVEMENT_TYPES: { value: MovementType; label: string }[] = [
  { value: 'IN',         label: 'Entrada'   },
  { value: 'OUT',        label: 'Salida'    },
  { value: 'ADJUSTMENT', label: 'Ajuste'    },
  { value: 'TRANSFER',   label: 'Traslado'  }
];
