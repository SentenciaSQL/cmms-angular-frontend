import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory.service';
import {
  InventoryItem, InventoryMovement, InventoryMovementCreateRequest,
  ITEM_TYPES, MOVEMENT_TYPES, MovementType
} from '../../../../core/models/inventory';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './inventory-detail.component.html',
  styleUrl: './inventory-detail.component.css'
})
export class InventoryDetailComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item: InventoryItem | null = null;
  movements: InventoryMovement[] = [];
  loading = true;
  loadingMovements = false;
  error: string | null = null;

  showMovementModal = false;
  savingMovement = false;
  movementError: string | null = null;

  movementForm: InventoryMovementCreateRequest = {
    inventoryItemId: 0,
    movementType: 'IN',
    quantity: 1,
    notes: '',
    referenceNumber: ''
  };

  readonly movementTypes = MOVEMENT_TYPES;
  readonly itemTypes = ITEM_TYPES;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.inventoryService.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.movementForm.inventoryItemId = data.id;
        this.loading = false;
        this.loadMovements(data.id);
      },
      error: () => { this.error = 'No se pudo cargar el ítem'; this.loading = false; }
    });
  }

  loadMovements(itemId: number): void {
    this.loadingMovements = true;
    this.inventoryService.getMovementsByItem(itemId).subscribe({
      next: (data) => { this.movements = data.slice(0, 20); this.loadingMovements = false; },
      error: () => { this.loadingMovements = false; }
    });
  }

  openMovementModal(): void {
    this.movementForm = {
      inventoryItemId: this.item!.id,
      movementType: 'IN',
      quantity: 1,
      notes: '',
      referenceNumber: ''
    };
    this.movementError = null;
    this.showMovementModal = true;
  }

  closeModal(): void { this.showMovementModal = false; }

  saveMovement(): void {
    if (this.movementForm.quantity < 1) { this.movementError = 'La cantidad debe ser mayor a 0'; return; }
    this.savingMovement = true;
    this.movementError = null;
    this.inventoryService.createMovement(this.movementForm).subscribe({
      next: () => {
        this.savingMovement = false;
        this.showMovementModal = false;
        this.load(this.item!.id);
      },
      error: (err) => {
        this.movementError = err?.error?.message || 'Error al registrar movimiento';
        this.savingMovement = false;
      }
    });
  }

  getTypeLabel(): string {
    return ITEM_TYPES.find(t => t.value === this.item?.itemType)?.label ?? '';
  }

  getTypeIcon(): string {
    return ITEM_TYPES.find(t => t.value === this.item?.itemType)?.icon ?? '📦';
  }

  getTypeBadge(): string {
    const map: Record<string, string> = {
      SPARE_PART: 'bg-blue-100 text-blue-700',
      TOOL:       'bg-purple-100 text-purple-700',
      CONSUMABLE: 'bg-orange-100 text-orange-700',
      MATERIAL:   'bg-teal-100 text-teal-700'
    };
    return map[this.item?.itemType ?? ''] ?? 'bg-gray-100 text-gray-600';
  }

  getStockPercent(): number {
    if (!this.item?.maxStock) return 0;
    return Math.min(100, Math.round((this.item.currentStock / this.item.maxStock) * 100));
  }

  getStockBarColor(): string {
    if (this.item?.isLowStock)   return 'bg-red-500';
    if (this.item?.needsReorder) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getMovementBadge(type: MovementType): string {
    const map: Record<string, string> = {
      IN:         'bg-green-100 text-green-700',
      OUT:        'bg-red-100 text-red-700',
      ADJUSTMENT: 'bg-blue-100 text-blue-700',
      TRANSFER:   'bg-purple-100 text-purple-700'
    };
    return map[type] ?? 'bg-gray-100 text-gray-600';
  }

  getMovementLabel(type: MovementType): string {
    return MOVEMENT_TYPES.find(m => m.value === type)?.label ?? type;
  }

  getMovementSign(type: MovementType): string {
    return type === 'IN' ? '+' : type === 'OUT' ? '-' : '~';
  }

  navigateBack(): void   { this.router.navigate(['/inventory/list']); }
  navigateToEdit(): void { if (this.item) this.router.navigate(['/inventory/edit', this.item.id]); }
}
