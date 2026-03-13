import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkOrdersService } from '../../../../core/services/work-orders.service';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority, PaginatedWorkOrders } from '../../../../core/models/work-order';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './work-order-list.component.html',
  styleUrl: './work-order-list.component.css'
})
export class WorkOrderListComponent implements OnInit {
  private woService = inject(WorkOrdersService);
  private router = inject(Router);

  workOrders: WorkOrder[] = [];
  loading = true;
  error: string | null = null;

  // Filtros
  searchQuery = '';
  selectedStatus = '';
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  today = new Date().toISOString().substring(0, 10);

  readonly statuses = [
    { value: '', label: 'Todos los estados' },
    { value: WorkOrderStatus.OPEN,        label: 'Abierta' },
    { value: WorkOrderStatus.IN_PROGRESS, label: 'En Progreso' },
    { value: WorkOrderStatus.COMPLETED,   label: 'Completada' },
    { value: WorkOrderStatus.CANCELLED,   label: 'Cancelada' }
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    const request$ = this.searchQuery.trim()
      ? this.woService.search(this.searchQuery, this.currentPage, this.pageSize)
      : this.selectedStatus
        ? this.woService.getByStatus(this.selectedStatus, this.currentPage, this.pageSize)
        : this.woService.getAll(this.currentPage, this.pageSize);

    request$.subscribe({
      next: (data: PaginatedWorkOrders) => {
        this.workOrders = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar las órdenes de trabajo';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.load();
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.searchQuery = '';
    this.load();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.load();
  }

  navigateToCreate(): void { this.router.navigate(['/work-orders/create']); }
  navigateToDetail(id: number): void { this.router.navigate(['/work-orders/detail', id]); }
  navigateToEdit(id: number): void { this.router.navigate(['/work-orders/edit', id]); }

  deleteWorkOrder(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta orden de trabajo?')) {
      this.woService.delete(id).subscribe({
        next: () => this.load(),
        error: () => alert('Error al eliminar la orden de trabajo')
      });
    }
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
      LOW:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      HIGH:   'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      URGENT: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return map[priority] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: WorkOrderStatus): string {
    const map: Record<string, string> = {
      OPEN: 'Abierta', IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completada', CANCELLED: 'Cancelada'
    };
    return map[status] || status;
  }

  getPriorityLabel(priority: WorkOrderPriority): string {
    const map: Record<string, string> = {
      LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', URGENT: 'Urgente'
    };
    return map[priority] || priority;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
