import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {MaintenancePlan, MaintenancePlanCreateRequest} from '../models/maintenance-plan';

@Injectable({
  providedIn: 'root',
})
export class MaintenancePlansService {
  private endpoint = '/maintenance-plans';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<MaintenancePlan[]> {
    return this.apiService.get<MaintenancePlan[]>(this.endpoint);
  }

  getById(id: number): Observable<MaintenancePlan> {
    return this.apiService.get<MaintenancePlan>(`${this.endpoint}/${id}`);
  }

  getByAsset(assetId: number): Observable<MaintenancePlan[]> {
    return this.apiService.get<MaintenancePlan[]>(`${this.endpoint}/asset/${assetId}`);
  }

  getDuePlans(): Observable<MaintenancePlan[]> {
    return this.apiService.get<MaintenancePlan[]>(`${this.endpoint}/due`);
  }

  create(data: MaintenancePlanCreateRequest): Observable<MaintenancePlan> {
    return this.apiService.post<MaintenancePlan>(this.endpoint, data);
  }

  update(id: number, data: MaintenancePlanCreateRequest): Observable<MaintenancePlan> {
    return this.apiService.put<MaintenancePlan>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  execute(id: number): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/${id}/execute`, {});
  }
}
