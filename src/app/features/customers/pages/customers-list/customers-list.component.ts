import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from '../../../../core/services/customers.service';
import { Customer } from '../../../../core/models/customer';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css'
})
export class CustomersListComponent implements OnInit {
  private service = inject(CustomersService);
  private router  = inject(Router);

  customers: Customer[] = [];
  filtered:  Customer[] = [];
  loading = true;
  error: string | null = null;

  searchQuery   = '';
  filterStatus: 'all' | 'active' | 'inactive' = 'all';

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
      next: (data) => { this.customers = data; this.applyFilters(); this.loading = false; },
      error: () => { this.error = 'Error al cargar clientes'; this.loading = false; }
    });
  }

  applyFilters(): void {
    let r = [...this.customers];
    if (this.filterStatus === 'inactive') r = r.filter(c => !c.isActive);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      r = r.filter(c =>
        (c.userFirstName + ' ' + c.userLastName).toLowerCase().includes(q) ||
        c.userEmail?.toLowerCase().includes(q) ||
        c.userName?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.position?.toLowerCase().includes(q)
      );
    }
    this.filtered = r;
  }

  onSearch(): void { this.applyFilters(); }

  setStatus(v: 'all' | 'active' | 'inactive'): void {
    this.filterStatus = v;
    this.searchQuery  = '';
    this.load();
  }

  goCreate(): void                { this.router.navigate(['/customers/create']); }
  goDetail(id: number): void      { this.router.navigate(['/customers/detail', id]); }
  goEdit(id: number, e: Event): void { e.stopPropagation(); this.router.navigate(['/customers/edit', id]); }

  delete(id: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('¿Eliminar este cliente?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Error al eliminar')
    });
  }

  getFullName(c: Customer): string {
    return [c.userFirstName, c.userLastName].filter(Boolean).join(' ') || c.userName || '—';
  }

  getInitials(c: Customer): string {
    const f = c.userFirstName?.charAt(0) || '';
    const l = c.userLastName?.charAt(0)  || '';
    return (f + l).toUpperCase() || c.userName?.charAt(0).toUpperCase() || '?';
  }

  getAvatarColor(id: number): string {
    const colors = ['bg-violet-500','bg-sky-500','bg-emerald-500','bg-rose-500','bg-amber-500','bg-cyan-500'];
    return colors[id % colors.length];
  }
}
