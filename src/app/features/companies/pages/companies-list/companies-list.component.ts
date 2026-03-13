import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../../core/services/companies.service';
import { Company } from '../../../../core/models/company';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.css'
})
export class CompaniesListComponent implements OnInit {
  private service = inject(CompaniesService);
  private router  = inject(Router);

  companies: Company[] = [];
  filtered:  Company[] = [];
  loading = true;
  error: string | null = null;

  searchQuery  = '';
  filterStatus: 'all' | 'active' | 'inactive' = 'all';

  readonly statusOptions: { v: 'all' | 'active' | 'inactive'; l: string }[] = [
    { v: 'all',      l: 'Todas'     },
    { v: 'active',   l: 'Activas'   },
    { v: 'inactive', l: 'Inactivas' }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error   = null;
    const req$ = this.filterStatus === 'active'
      ? this.service.getActiveCompanies()
      : this.service.getAllCompanies();

    req$.subscribe({
      next: (data) => { this.companies = data; this.applyFilters(); this.loading = false; },
      error: () => { this.error = 'Error al cargar empresas'; this.loading = false; }
    });
  }

  applyFilters(): void {
    let r = [...this.companies];
    if (this.filterStatus === 'inactive') r = r.filter(c => !c.isActive);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      r = r.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.taxId?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
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

  goCreate(): void                { this.router.navigate(['/companies-sites/create']); }
  goDetail(id: number): void      { this.router.navigate(['/companies-sites/detail', id]); }
  goEdit(id: number, e: Event): void { e.stopPropagation(); this.router.navigate(['/companies-sites/edit', id]); }

  delete(id: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('¿Desactivar esta empresa?')) return;
    this.service.deleteCompany(id).subscribe({
      next: () => this.load(),
      error: () => alert('Error al eliminar')
    });
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = ['bg-blue-600','bg-indigo-600','bg-violet-600','bg-teal-600','bg-cyan-600','bg-emerald-600'];
    return colors[id % colors.length];
  }
}
