import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../../../core/services/companies.service';
import { Company, Site, SiteCreateRequest } from '../../../../core/models/company';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-sites-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './sites-form.component.html',
  styleUrl: './sites-form.component.css'
})
export class SitesFormComponent implements OnInit {
  private service = inject(CompaniesService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  isEditMode  = false;
  siteId: number | null = null;
  loading     = false;
  loadingData = false;
  error: string | null = null;

  companies: Company[] = [];
  returnCompanyId: number | null = null;

  form: SiteCreateRequest & { isActive: boolean } = {
    companyId: 0, name: '', code: '',
    address: '', city: '', state: '', country: '', isActive: true
  };

  ngOnInit(): void {
    // Load companies for selector
    this.service.getAllCompanies().subscribe({
      next: (cs) => { this.companies = cs.filter(c => c.isActive); }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.siteId = Number(id);
      this.loadData(this.siteId);
    } else {
      // Pre-fill companyId from query param
      const qCompanyId = this.route.snapshot.queryParamMap.get('companyId');
      if (qCompanyId) {
        this.form.companyId     = Number(qCompanyId);
        this.returnCompanyId    = Number(qCompanyId);
      }
    }
  }

  loadData(id: number): void {
    this.loadingData = true;
    this.service.getSiteById(id).subscribe({
      next: (s: Site) => {
        this.returnCompanyId = s.companyId;
        this.form = {
          companyId: s.companyId, name: s.name, code: s.code ?? '',
          address: s.address ?? '', city: s.city ?? '',
          state: s.state ?? '', country: s.country ?? '', isActive: s.isActive
        };
        this.loadingData = false;
      },
      error: () => { this.error = 'No se pudo cargar el sitio'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.companyId) { this.error = 'La empresa es requerida'; return; }
    if (!this.form.name?.trim()) { this.error = 'El nombre del sitio es requerido'; return; }

    this.loading = true;
    this.error   = null;

    const payload: SiteCreateRequest = {
      companyId: this.form.companyId,
      name:      this.form.name,
      code:      this.form.code    || undefined,
      address:   this.form.address || undefined,
      city:      this.form.city    || undefined,
      state:     this.form.state   || undefined,
      country:   this.form.country || undefined,
      isActive:  this.form.isActive
    };

    const req$ = this.isEditMode && this.siteId
      ? this.service.updateSite(this.siteId, payload)
      : this.service.createSite(payload);

    req$.subscribe({
      next: (s: Site) => {
        this.loading = false;
        this.router.navigate(['/companies-sites/detail', s.companyId]);
      },
      error: (err: any) => { this.error = err?.error?.message || 'Error al guardar'; this.loading = false; }
    });
  }

  onCancel(): void {
    const backId = this.returnCompanyId ?? this.form.companyId;
    backId
      ? this.router.navigate(['/companies-sites/detail', backId])
      : this.router.navigate(['/companies-sites/list']);
  }
}
