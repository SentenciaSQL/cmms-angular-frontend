import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory.service';
import { InventoryItem, ITEM_TYPES, ItemType } from '../../../../core/models/inventory';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css'
})
export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  items: InventoryItem[] = [];
  filtered: InventoryItem[] = [];
  loading = true;
  error: string | null = null;

  searchQuery = '';
  filterType: ItemType | '' = '';
  filterStock: 'all' | 'low' | 'ok' = 'all';

  readonly itemTypes = ITEM_TYPES;

  readonly stockOptions: { v: 'all' | 'low' | 'ok'; l: string }[] = [
    { v: 'all', l: 'Todos' },
    { v: 'low', l: '⚠ Stock Bajo' },
    { v: 'ok',  l: '✓ Stock OK' }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = null;
    const req$ = this.filterStock === 'low'
      ? this.inventoryService.getLowStock()
      : this.inventoryService.getAll();

    req$.subscribe({
      next: (data) => { this.items = data; this.applyFilters(); this.loading = false; },
      error: () => { this.error = 'Error al cargar inventario'; this.loading = false; }
    });
  }

  applyFilters(): void {
    let result = [...this.items];
    if (this.filterStock === 'ok') result = result.filter(i => !i.isLowStock);
    if (this.filterType) result = result.filter(i => i.itemType === this.filterType);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.partNumber?.toLowerCase().includes(q) ||
        i.manufacturer?.toLowerCase().includes(q)
      );
    }
    this.filtered = result;
  }

  onSearch(): void { this.applyFilters(); }
  onTypeChange(): void { this.applyFilters(); }

  setStockFilter(v: 'all' | 'low' | 'ok'): void {
    this.filterStock = v;
    if (v === 'low') { this.load(); } else { this.filterStock = v; this.applyFilters(); }
  }

  navigateToCreate(): void           { this.router.navigate(['/inventory/create']); }
  navigateToDetail(id: number): void { this.router.navigate(['/inventory/detail', id]); }
  navigateToEdit(id: number): void   { this.router.navigate(['/inventory/edit', id]); }

  deleteItem(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('¿Estás seguro de eliminar este ítem?')) return;
    this.inventoryService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Error al eliminar')
    });
  }

  getTypeLabel(type: ItemType): string {
    return ITEM_TYPES.find(t => t.value === type)?.label ?? type;
  }

  getTypeIcon(type: ItemType): string {
    return ITEM_TYPES.find(t => t.value === type)?.icon ?? '📦';
  }

  getTypeBadge(type: ItemType): string {
    const map: Record<string, string> = {
      SPARE_PART: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      TOOL:       'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      CONSUMABLE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      MATERIAL:   'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
    };
    return map[type] ?? 'bg-gray-100 text-gray-600';
  }

  getStockPercent(item: InventoryItem): number {
    if (!item.maxStock) return 0;
    return Math.min(100, Math.round((item.currentStock / item.maxStock) * 100));
  }

  getStockBarColor(item: InventoryItem): string {
    if (item.isLowStock)    return 'bg-red-500';
    if (item.needsReorder)  return 'bg-yellow-500';
    return 'bg-green-500';
  }

  get lowStockCount(): number { return this.items.filter(i => i.isLowStock).length; }
  get needsReorderCount(): number { return this.items.filter(i => i.needsReorder && !i.isLowStock).length; }
}
