import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../../../core/services/customers.service';
import { Customer } from '../../../../core/models/customer';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-customers-detail',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './customers-detail.component.html',
  styleUrl: './customers-detail.component.css'
})
export class CustomersDetailComponent implements OnInit {
  private service = inject(CustomersService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  customer: Customer | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (c) => { this.customer = c; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar el cliente'; this.loading = false; }
    });
  }

  getFullName(): string {
    const c = this.customer;
    if (!c) return '';
    return [c.userFirstName, c.userLastName].filter(Boolean).join(' ') || c.userName || '—';
  }

  getInitials(): string {
    const c = this.customer;
    if (!c) return '?';
    const f = c.userFirstName?.charAt(0) || '';
    const l = c.userLastName?.charAt(0)  || '';
    return (f + l).toUpperCase() || c.userName?.charAt(0).toUpperCase() || '?';
  }

  getAvatarColor(): string {
    const colors = ['bg-violet-500','bg-sky-500','bg-emerald-500','bg-rose-500','bg-amber-500','bg-cyan-500'];
    return colors[(this.customer?.id ?? 0) % colors.length];
  }

  goBack(): void   { this.router.navigate(['/customers/list']); }
  goEdit(): void   { if (this.customer) this.router.navigate(['/customers/edit', this.customer.id]); }
  goToWorkOrders(): void { this.router.navigate(['/work-orders/list']); }
}
