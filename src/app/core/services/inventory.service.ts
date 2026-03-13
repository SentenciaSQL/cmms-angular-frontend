import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  InventoryItem, InventoryItemCreateRequest,
  InventoryMovement, InventoryMovementCreateRequest
} from '../models/inventory';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private itemsEndpoint     = '/inventory-items';
  private movementsEndpoint = '/inventory-movements';

  constructor(private api: ApiService) {}

  // Items
  getAll(): Observable<InventoryItem[]> {
    return this.api.get<InventoryItem[]>(this.itemsEndpoint);
  }

  getLowStock(): Observable<InventoryItem[]> {
    return this.api.get<InventoryItem[]>(`${this.itemsEndpoint}/low-stock`);
  }

  getById(id: number): Observable<InventoryItem> {
    return this.api.get<InventoryItem>(`${this.itemsEndpoint}/${id}`);
  }

  create(data: InventoryItemCreateRequest): Observable<InventoryItem> {
    return this.api.post<InventoryItem>(this.itemsEndpoint, data);
  }

  update(id: number, data: InventoryItemCreateRequest): Observable<InventoryItem> {
    return this.api.put<InventoryItem>(`${this.itemsEndpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.itemsEndpoint}/${id}`);
  }

  // Movements
  getAllMovements(): Observable<InventoryMovement[]> {
    return this.api.get<InventoryMovement[]>(this.movementsEndpoint);
  }

  getMovementsByItem(itemId: number): Observable<InventoryMovement[]> {
    return this.api.get<InventoryMovement[]>(`${this.movementsEndpoint}/item/${itemId}`);
  }

  createMovement(data: InventoryMovementCreateRequest): Observable<InventoryMovement> {
    return this.api.post<InventoryMovement>(this.movementsEndpoint, data);
  }
}
