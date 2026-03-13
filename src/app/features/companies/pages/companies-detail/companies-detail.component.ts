import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../../../core/services/companies.service';
import { Company, Site } from '../../../../core/models/company';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-companies-detail',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './companies-detail.component.html',
  styleUrl: './companies-detail.component.css'
})
export class CompaniesDetailComponent implements OnInit {
  private service = inject(CompaniesService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  company: Company | null = null;
  sites:   Site[]         = [];
  loading      = true;
  loadingSites = false;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.service.getCompanyById(id).subscribe({
      next: (c) => {
        this.company = c;
        this.loading = false;
        this.loadSites(id);
      },
      error: () => { this.error = 'No se pudo cargar la empresa'; this.loading = false; }
    });
  }

  loadSites(companyId: number): void {
    this.loadingSites = true;
    this.service.getSitesByCompany(companyId).subscribe({
      next: (sites) => { this.sites = sites; this.loadingSites = false; },
      error: () => { this.loadingSites = false; }
    });
  }

  deleteSite(siteId: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('¿Eliminar este sitio?')) return;
    this.service.deleteSite(siteId).subscribe({
      next: () => { if (this.company) this.loadSites(this.company.id); },
      error: () => alert('Error al eliminar el sitio')
    });
  }

  getInitials(): string {
    return (this.company?.name ?? '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getAvatarColor(): string {
    const colors = ['bg-blue-600','bg-indigo-600','bg-violet-600','bg-teal-600','bg-cyan-600','bg-emerald-600'];
    return colors[(this.company?.id ?? 0) % colors.length];
  }

  getSiteLocation(s: Site): string {
    return [s.city, s.state, s.country].filter(Boolean).join(', ') || s.address || '—';
  }

  get activeSitesCount(): number { return this.sites.filter(s => s.isActive).length; }

  goBack():   void { this.router.navigate(['/companies-sites/list']); }
  goEdit():   void { if (this.company) this.router.navigate(['/companies-sites/edit', this.company.id]); }
  goAddSite():void { if (this.company) this.router.navigate(['/companies-sites/sites/create'], { queryParams: { companyId: this.company.id } }); }
  goEditSite(id: number): void { this.router.navigate(['/companies-sites/sites/edit', id]); }
  goToAssets(): void { this.router.navigate(['/assets/list']); }
}
