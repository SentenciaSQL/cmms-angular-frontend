import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../../../core/services/work-orders.service';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority, WorkOrderStatusUpdateRequest } from '../../../../core/models/work-order';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-work-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './work-order-detail.component.html',
  styleUrl: './work-order-detail.component.css'
})
export class WorkOrderDetailComponent implements OnInit {
  private woService = inject(WorkOrdersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  workOrder: WorkOrder | null = null;
  loading = true;
  error: string | null = null;

  // Estado: modal de cambio de estado
  showStatusModal = false;
  newStatus: WorkOrderStatus = WorkOrderStatus.OPEN;
  actualHours: number | null = null;
  statusNotes = '';
  statusUpdating = false;

  readonly WorkOrderStatus = WorkOrderStatus;

  readonly validTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
    [WorkOrderStatus.OPEN]:        [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
    [WorkOrderStatus.IN_PROGRESS]: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED],
    [WorkOrderStatus.COMPLETED]:   [],
    [WorkOrderStatus.CANCELLED]:   []
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadWorkOrder(id);
  }

  loadWorkOrder(id: number): void {
    this.loading = true;
    this.woService.getById(id).subscribe({
      next: (data) => { this.workOrder = data; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar la orden de trabajo'; this.loading = false; }
    });
  }

  openStatusModal(targetStatus: WorkOrderStatus): void {
    this.newStatus = targetStatus;
    this.actualHours = null;
    this.statusNotes = '';
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
  }

  confirmStatusChange(): void {
    if (!this.workOrder) return;
    this.statusUpdating = true;

    const req: WorkOrderStatusUpdateRequest = {
      status: this.newStatus,
      actualHours: this.actualHours ?? undefined,
      notes: this.statusNotes || undefined
    };

    this.woService.updateStatus(this.workOrder.id, req).subscribe({
      next: (updated) => {
        this.workOrder = updated;
        this.showStatusModal = false;
        this.statusUpdating = false;
      },
      error: () => {
        alert('Error al actualizar el estado');
        this.statusUpdating = false;
      }
    });
  }

  getAvailableTransitions(): WorkOrderStatus[] {
    if (!this.workOrder) return [];
    return this.validTransitions[this.workOrder.status] || [];
  }

  getStatusClass(status: WorkOrderStatus): string {
    const map: Record<string, string> = {
      OPEN:        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      COMPLETED:   'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      CANCELLED:   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(priority: WorkOrderPriority): string {
    const map: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-700', MEDIUM: 'bg-blue-100 text-blue-700',
      HIGH: 'bg-orange-100 text-orange-700', URGENT: 'bg-red-100 text-red-700'
    };
    return map[priority] || 'bg-gray-100 text-gray-700';
  }

  getStatusLabel(status: WorkOrderStatus): string {
    const map: Record<string, string> = {
      OPEN: 'Abierta', IN_PROGRESS: 'En Progreso', COMPLETED: 'Completada', CANCELLED: 'Cancelada'
    };
    return map[status] || status;
  }

  getPriorityLabel(priority: WorkOrderPriority): string {
    const map: Record<string, string> = {
      LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', URGENT: 'Urgente'
    };
    return map[priority] || priority;
  }

  getTransitionLabel(status: WorkOrderStatus): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'Iniciar', COMPLETED: 'Completar', CANCELLED: 'Cancelar'
    };
    return map[status] || status;
  }

  getTransitionClass(status: WorkOrderStatus): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      COMPLETED:   'bg-green-600 hover:bg-green-700 text-white',
      CANCELLED:   'bg-red-600 hover:bg-red-700 text-white'
    };
    return map[status] || 'bg-gray-500 text-white';
  }

  navigateBack(): void {
    this.router.navigate(['/work-orders/list']);
  }

  navigateToEdit(): void {
    if (this.workOrder) this.router.navigate(['/work-orders/edit', this.workOrder.id]);
  }
}
