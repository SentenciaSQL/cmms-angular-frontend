import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SuppliersService } from '../../../../core/services/suppliers.service';
import { Supplier, SUPPLIER_TYPES } from '../../../../core/models/supplier';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './suppliers-list.component.html',
  styleUrl: './suppliers-list.component.css'
})
export class SuppliersListComponent implements OnInit {
  private service = inject(SuppliersService);
  private router  = inject(Router);

  suppliers: Supplier[] = [];
  filtered:  Supplier[] = [];
  loading = true;
  error: string | null = null;

  searchQuery  = '';
  filterStatus: 'all' | 'active' | 'inactive' = 'all';
  filterType   = '';

  readonly supplierTypes = SUPPLIER_TYPES;
  readonly statusOptions: { v: 'all' | 'active' | 'inactive'; l: string }[] = [
    { v: 'all',      l: 'Todos'     },
    { v: 'active',   l: 'Activos'   },
    { v: 'inactive', l: 'Inactivos' }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error   = null;
    const req$ = this.filterStatus === 'active'
      ? this.service.getActive()
      : this.service.getAll();

    req$.subscribe({
      next: (data) => {
        this.suppliers = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.error = 'Error al cargar proveedores'; this.loading = false; }
    });
  }

  applyFilters(): void {
    let r = [...this.suppliers];
    if (this.filterStatus === 'inactive') r = r.filter(s => !s.isActive);
    if (this.filterType) r = r.filter(s => s.supplierType === this.filterType);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      r = r.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code?.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.contactPerson?.toLowerCase().includes(q)
      );
    }
    this.filtered = r;
  }

  onSearch(): void { this.applyFilters(); }
  onTypeChange(): void { this.applyFilters(); }

  setStatus(v: 'all' | 'active' | 'inactive'): void {
    this.filterStatus = v;
    this.filterType = '';
    this.searchQuery = '';
    this.load();
  }

  goCreate(): void                { this.router.navigate(['/suppliers/create']); }
  goDetail(id: number): void      { this.router.navigate(['/suppliers/detail', id]); }
  goEdit(id: number, e: Event): void { e.stopPropagation(); this.router.navigate(['/suppliers/edit', id]); }

  delete(id: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('¿Eliminar este proveedor?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Error al eliminar')
    });
  }

  getTypeLabel(type?: string): string {
    return SUPPLIER_TYPES.find(t => t.value === type)?.label ?? '—';
  }

  getTypeBadge(type?: string): string {
    const map: Record<string, string> = {
      PARTS:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      TOOLS:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      SERVICES:  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
      MATERIALS: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      GENERAL:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    };
    return map[type ?? ''] ?? 'bg-gray-100 text-gray-600';
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = ['bg-blue-500','bg-purple-500','bg-teal-500','bg-orange-500','bg-pink-500','bg-indigo-500'];
    return colors[id % colors.length];
  }
}
