import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory.service';
import {
  InventoryItem, InventoryItemCreateRequest, ITEM_TYPES, ItemType
} from '../../../../core/models/inventory';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.css'
})
export class InventoryFormComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  itemId: number | null = null;
  loading = false;
  loadingData = false;
  error: string | null = null;

  readonly itemTypes = ITEM_TYPES;

  form: InventoryItemCreateRequest = {
    code: '', name: '', description: '',
    itemType: 'SPARE_PART',
    currentStock: 0, minStock: 0, maxStock: 100, reorderPoint: 10,
    unit: 'unidad',
    unitCost: undefined, location: '', manufacturer: '', partNumber: ''
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = Number(id);
      this.loadItem(this.itemId);
    }
  }

  loadItem(id: number): void {
    this.loadingData = true;
    this.inventoryService.getById(id).subscribe({
      next: (item: InventoryItem) => {
        this.form = {
          code: item.code, name: item.name, description: item.description || '',
          itemType: item.itemType,
          currentStock: item.currentStock, minStock: item.minStock,
          maxStock: item.maxStock, reorderPoint: item.reorderPoint,
          unit: item.unit, unitCost: item.unitCost,
          location: item.location || '', manufacturer: item.manufacturer || '',
          partNumber: item.partNumber || ''
        };
        this.loadingData = false;
      },
      error: () => { this.error = 'No se pudo cargar el ítem'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.code?.trim())  { this.error = 'El código es requerido'; return; }
    if (!this.form.name?.trim())  { this.error = 'El nombre es requerido'; return; }
    if (!this.form.unit?.trim())  { this.error = 'La unidad es requerida'; return; }
    if (this.form.maxStock <= 0)  { this.error = 'El stock máximo debe ser mayor a 0'; return; }

    this.loading = true;
    this.error = null;

    const payload: InventoryItemCreateRequest = {
      ...this.form,
      description:  this.form.description  || undefined,
      location:     this.form.location     || undefined,
      manufacturer: this.form.manufacturer || undefined,
      partNumber:   this.form.partNumber   || undefined,
      unitCost:     this.form.unitCost     || undefined
    };

    const req$ = this.isEditMode && this.itemId
      ? this.inventoryService.update(this.itemId, payload)
      : this.inventoryService.create(payload);

    req$.subscribe({
      next: (item: InventoryItem) => { this.loading = false; this.router.navigate(['/inventory/detail', item.id]); },
      error: (err) => { this.error = err?.error?.message || 'Error al guardar'; this.loading = false; }
    });
  }

  onCancel(): void {
    this.isEditMode && this.itemId
      ? this.router.navigate(['/inventory/detail', this.itemId])
      : this.router.navigate(['/inventory/list']);
  }

  setItemType(type: ItemType): void { this.form.itemType = type; }
}
