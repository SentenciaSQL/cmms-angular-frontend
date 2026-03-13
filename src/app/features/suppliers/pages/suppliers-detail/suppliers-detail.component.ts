import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SuppliersService } from '../../../../core/services/suppliers.service';
import { Supplier, SUPPLIER_TYPES } from '../../../../core/models/supplier';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-suppliers-detail',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './suppliers-detail.component.html',
  styleUrl: './suppliers-detail.component.css'
})
export class SuppliersDetailComponent implements OnInit {
  private service = inject(SuppliersService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  supplier: Supplier | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (s) => { this.supplier = s; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar el proveedor'; this.loading = false; }
    });
  }

  getTypeLabel(): string { return SUPPLIER_TYPES.find(t => t.value === this.supplier?.supplierType)?.label ?? '—'; }
  getTypeIcon():  string { return SUPPLIER_TYPES.find(t => t.value === this.supplier?.supplierType)?.icon  ?? ''; }

  getTypeBadge(): string {
    const map: Record<string, string> = {
      PARTS:     'bg-blue-100 text-blue-700',
      TOOLS:     'bg-purple-100 text-purple-700',
      SERVICES:  'bg-teal-100 text-teal-700',
      MATERIALS: 'bg-orange-100 text-orange-700',
      GENERAL:   'bg-gray-100 text-gray-700'
    };
    return map[this.supplier?.supplierType ?? ''] ?? 'bg-gray-100 text-gray-600';
  }

  getInitials(): string {
    return (this.supplier?.name ?? '?').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  }

  getAvatarColor(): string {
    const colors = ['bg-blue-500','bg-purple-500','bg-teal-500','bg-orange-500','bg-pink-500','bg-indigo-500'];
    return colors[(this.supplier?.id ?? 0) % colors.length];
  }

  get fullAddress(): string {
    const a = this.supplier?.address;
    if (!a) return '—';
    return [a.street, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(', ');
  }

  goBack(): void   { this.router.navigate(['/suppliers/list']); }
  goEdit(): void   { if (this.supplier) this.router.navigate(['/suppliers/edit', this.supplier.id]); }
}
