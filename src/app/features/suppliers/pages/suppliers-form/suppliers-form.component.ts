import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuppliersService } from '../../../../core/services/suppliers.service';
import { Supplier, SupplierCreateRequest, SUPPLIER_TYPES } from '../../../../core/models/supplier';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-suppliers-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './suppliers-form.component.html',
  styleUrl: './suppliers-form.component.css'
})
export class SuppliersFormComponent implements OnInit {
  private service = inject(SuppliersService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  isEditMode  = false;
  supplierId: number | null = null;
  loading     = false;
  loadingData = false;
  error: string | null = null;

  readonly supplierTypes = SUPPLIER_TYPES;

  form: SupplierCreateRequest & { isActive: boolean } = {
    name: '', code: '', description: '', email: '',
    phone: '', mobile: '', website: '', taxId: '',
    contactPerson: '', contactEmail: '', contactPhone: '',
    supplierType: undefined, notes: '', isActive: true,
    address: { street: '', city: '', state: '', postalCode: '', country: '' }
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEditMode = true; this.supplierId = Number(id); this.loadData(this.supplierId); }
  }

  loadData(id: number): void {
    this.loadingData = true;
    this.service.getById(id).subscribe({
      next: (s: Supplier) => {
        this.form = {
          name: s.name, code: s.code ?? '', description: s.description ?? '',
          email: s.email, phone: s.phone ?? '', mobile: s.mobile ?? '',
          website: s.website ?? '', taxId: s.taxId ?? '',
          contactPerson: s.contactPerson ?? '', contactEmail: s.contactEmail ?? '',
          contactPhone: s.contactPhone ?? '', supplierType: s.supplierType,
          notes: s.notes ?? '', isActive: s.isActive,
          address: { ...s.address }
        };
        this.loadingData = false;
      },
      error: () => { this.error = 'No se pudo cargar el proveedor'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.name?.trim())  { this.error = 'El nombre es requerido'; return; }
    if (!this.form.email?.trim()) { this.error = 'El email es requerido'; return; }

    this.loading = true;
    this.error   = null;

    const payload: any = {
      ...this.form,
      code:         this.form.code         || undefined,
      description:  this.form.description  || undefined,
      phone:        this.form.phone        || undefined,
      mobile:       this.form.mobile       || undefined,
      website:      this.form.website      || undefined,
      taxId:        this.form.taxId        || undefined,
      contactPerson: this.form.contactPerson || undefined,
      contactEmail:  this.form.contactEmail  || undefined,
      contactPhone:  this.form.contactPhone  || undefined,
      notes:        this.form.notes        || undefined,
      supplierType: this.form.supplierType || undefined,
      address: (this.form.address?.street || this.form.address?.city) ? this.form.address : undefined
    };

    const req$ = this.isEditMode && this.supplierId
      ? this.service.update(this.supplierId, payload)
      : this.service.create(payload);

    req$.subscribe({
      next: (s: Supplier) => { this.loading = false; this.router.navigate(['/suppliers/detail', s.id]); },
      error: (err: any) => { this.error = err?.error?.message || 'Error al guardar'; this.loading = false; }
    });
  }

  onCancel(): void {
    this.isEditMode && this.supplierId
      ? this.router.navigate(['/suppliers/detail', this.supplierId])
      : this.router.navigate(['/suppliers/list']);
  }
}
