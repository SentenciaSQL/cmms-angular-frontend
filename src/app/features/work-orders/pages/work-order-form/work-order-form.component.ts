import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../../../core/services/work-orders.service';
import { WorkOrder, WorkOrderCreateRequest, WorkOrderPriority } from '../../../../core/models/work-order';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-work-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './work-order-form.component.html',
  styleUrl: './work-order-form.component.css'
})
export class WorkOrderFormComponent implements OnInit {
  private woService = inject(WorkOrdersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  workOrderId: number | null = null;
  loading = false;
  loadingData = false;
  error: string | null = null;

  form: WorkOrderCreateRequest = {
    title: '',
    description: '',
    priority: WorkOrderPriority.MEDIUM,
    assetId: undefined,
    siteId: undefined,
    companyId: undefined,
    assignedTechnicianId: undefined,
    dueDate: '',
    scheduledStart: '',
    scheduledEnd: '',
    estimatedHours: undefined,
    notes: ''
  };

  readonly priorities = [
    { value: WorkOrderPriority.LOW,    label: 'Baja' },
    { value: WorkOrderPriority.MEDIUM, label: 'Media' },
    { value: WorkOrderPriority.HIGH,   label: 'Alta' },
    { value: WorkOrderPriority.URGENT, label: 'Urgente' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.workOrderId = Number(id);
      this.loadWorkOrder(this.workOrderId);
    }
  }

  loadWorkOrder(id: number): void {
    this.loadingData = true;
    this.woService.getById(id).subscribe({
      next: (wo: WorkOrder) => {
        this.form = {
          title:                wo.title,
          description:          wo.description || '',
          priority:             wo.priority,
          assetId:              wo.assetId,
          siteId:               wo.siteId,
          companyId:            wo.companyId,
          assignedTechnicianId: wo.assignedTechnicianId,
          dueDate:              wo.dueDate ? wo.dueDate.substring(0, 10) : '',
          scheduledStart:       wo.scheduledStart ? wo.scheduledStart.substring(0, 16) : '',
          scheduledEnd:         wo.scheduledEnd ? wo.scheduledEnd.substring(0, 16) : '',
          estimatedHours:       wo.estimatedHours,
          notes:                wo.notes || ''
        };
        this.loadingData = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la orden de trabajo';
        this.loadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.form.title.trim()) {
      this.error = 'El título es requerido';
      return;
    }

    this.loading = true;
    this.error = null;

    // Clean empty strings → undefined
    const payload: WorkOrderCreateRequest = {
      ...this.form,
      dueDate:       this.form.dueDate || undefined,
      scheduledStart: this.form.scheduledStart || undefined,
      scheduledEnd:   this.form.scheduledEnd || undefined,
      description:    this.form.description || undefined,
      notes:          this.form.notes || undefined
    };

    const request$ = this.isEditMode && this.workOrderId
      ? this.woService.update(this.workOrderId, payload)
      : this.woService.create(payload);

    request$.subscribe({
      next: (wo: WorkOrder) => {
        this.loading = false;
        this.router.navigate(['/work-orders/detail', wo.id]);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al guardar la orden de trabajo';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.workOrderId) {
      this.router.navigate(['/work-orders/detail', this.workOrderId]);
    } else {
      this.router.navigate(['/work-orders/list']);
    }
  }
}
