import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  WorkOrder,
  WorkOrderCreateRequest,
  WorkOrderStatusUpdateRequest,
  PaginatedWorkOrders
} from '../models/work-order';

@Injectable({ providedIn: 'root' })
export class WorkOrdersService {
  private endpoint = '/work-orders';

  constructor(private api: ApiService) {}

  getAll(page = 0, size = 20): Observable<PaginatedWorkOrders> {
    return this.api.get<PaginatedWorkOrders>(`${this.endpoint}?page=${page}&size=${size}`);
  }

  getById(id: number): Observable<WorkOrder> {
    return this.api.get<WorkOrder>(`${this.endpoint}/${id}`);
  }

  getByStatus(status: string, page = 0, size = 20): Observable<PaginatedWorkOrders> {
    return this.api.get<PaginatedWorkOrders>(
      `${this.endpoint}/status/${status}?page=${page}&size=${size}`
    );
  }

  getOverdue(): Observable<WorkOrder[]> {
    return this.api.get<WorkOrder[]>(`${this.endpoint}/overdue`);
  }

  search(query: string, page = 0, size = 20): Observable<PaginatedWorkOrders> {
    return this.api.get<PaginatedWorkOrders>(
      `${this.endpoint}/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );
  }

  create(data: WorkOrderCreateRequest): Observable<WorkOrder> {
    return this.api.post<WorkOrder>(this.endpoint, data);
  }

  update(id: number, data: WorkOrderCreateRequest): Observable<WorkOrder> {
    return this.api.put<WorkOrder>(`${this.endpoint}/${id}`, data);
  }

  updateStatus(id: number, data: WorkOrderStatusUpdateRequest): Observable<WorkOrder> {
    return this.api.patch<WorkOrder>(`${this.endpoint}/${id}/status`, data);
  }

  assignTechnician(workOrderId: number, technicianId: number): Observable<WorkOrder> {
    return this.api.patch<WorkOrder>(
      `${this.endpoint}/${workOrderId}/assign/${technicianId}`, {}
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
