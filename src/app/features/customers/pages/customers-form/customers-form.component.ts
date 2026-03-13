import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../../../core/services/customers.service';
import { Customer, CustomerCreateRequest } from '../../../../core/models/customer';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './customers-form.component.html',
  styleUrl: './customers-form.component.css'
})
export class CustomersFormComponent implements OnInit {
  private service = inject(CustomersService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  isEditMode   = false;
  customerId: number | null = null;
  loading     = false;
  loadingData = false;
  error: string | null = null;

  form: CustomerCreateRequest & { isActive: boolean } = {
    userId: 0, companyId: undefined,
    position: '', phoneAlt: '', notes: '', isActive: true
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEditMode = true; this.customerId = Number(id); this.loadData(this.customerId); }
  }

  loadData(id: number): void {
    this.loadingData = true;
    this.service.getById(id).subscribe({
      next: (c: Customer) => {
        this.form = {
          userId:    c.userId,
          companyId: c.companyId,
          position:  c.position  ?? '',
          phoneAlt:  c.phoneAlt  ?? '',
          notes:     c.notes     ?? '',
          isActive:  c.isActive
        };
        this.loadingData = false;
      },
      error: () => { this.error = 'No se pudo cargar el cliente'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.userId || this.form.userId < 1) { this.error = 'El ID de usuario es requerido'; return; }

    this.loading = true;
    this.error   = null;

    const payload: CustomerCreateRequest = {
      userId:    this.form.userId,
      companyId: this.form.companyId  || undefined,
      position:  this.form.position   || undefined,
      phoneAlt:  this.form.phoneAlt   || undefined,
      notes:     this.form.notes      || undefined,
      isActive:  this.form.isActive
    };

    const req$ = this.isEditMode && this.customerId
      ? this.service.update(this.customerId, payload)
      : this.service.create(payload);

    req$.subscribe({
      next: (c: Customer) => { this.loading = false; this.router.navigate(['/customers/detail', c.id]); },
      error: (err: any) => { this.error = err?.error?.message || 'Error al guardar'; this.loading = false; }
    });
  }

  onCancel(): void {
    this.isEditMode && this.customerId
      ? this.router.navigate(['/customers/detail', this.customerId])
      : this.router.navigate(['/customers/list']);
  }
}
