export interface InventoryMovement {
  id: number;
  inventoryItem: InventoryItemSummary;
  movementType: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  unitCost?: number;
  totalCost?: number;
  workOrder?: WorkOrderSummary;
  user: UserSummary;
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

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER'
}

interface InventoryItemSummary {
  id: number;
  code: string;
  name: string;
}

interface WorkOrderSummary {
  id: number;
  code: string;
  title: string;
}

interface UserSummary {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}
