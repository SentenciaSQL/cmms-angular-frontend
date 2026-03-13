import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../../../core/services/companies.service';
import { Company, CompanyCreateRequest } from '../../../../core/models/company';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-companies-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './companies-form.component.html',
  styleUrl: './companies-form.component.css'
})
export class CompaniesFormComponent implements OnInit {
  private service = inject(CompaniesService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  isEditMode   = false;
  companyId: number | null = null;
  loading     = false;
  loadingData = false;
  error: string | null = null;

  form: CompanyCreateRequest & { isActive: boolean } = {
    name: '', taxId: '', phone: '', email: '', address: '', isActive: true
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEditMode = true; this.companyId = Number(id); this.loadData(this.companyId); }
  }

  loadData(id: number): void {
    this.loadingData = true;
    this.service.getCompanyById(id).subscribe({
      next: (c: Company) => {
        this.form = {
          name: c.name, taxId: c.taxId ?? '', phone: c.phone ?? '',
          email: c.email ?? '', address: c.address ?? '', isActive: c.isActive
        };
        this.loadingData = false;
      },
      error: () => { this.error = 'No se pudo cargar la empresa'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.name?.trim()) { this.error = 'El nombre es requerido'; return; }
    this.loading = true;
    this.error   = null;

    const payload: any = {
      ...this.form,
      taxId:   this.form.taxId   || undefined,
      phone:   this.form.phone   || undefined,
      email:   this.form.email   || undefined,
      address: this.form.address || undefined,
    };

    const req$ = this.isEditMode && this.companyId
      ? this.service.updateCompany(this.companyId, payload)
      : this.service.createCompany(payload);

    req$.subscribe({
      next: (c: Company) => { this.loading = false; this.router.navigate(['/companies-sites/detail', c.id]); },
      error: (err: any) => { this.error = err?.error?.message || 'Error al guardar'; this.loading = false; }
    });
  }

  onCancel(): void {
    this.isEditMode && this.companyId
      ? this.router.navigate(['/companies-sites/detail', this.companyId])
      : this.router.navigate(['/companies-sites/list']);
  }
}
