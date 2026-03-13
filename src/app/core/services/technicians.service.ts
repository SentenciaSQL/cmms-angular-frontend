import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Technician, TechnicianCreateRequest } from '../models/technician';

@Injectable({ providedIn: 'root' })
export class TechniciansService {
  private endpoint = '/technicians';

  constructor(private api: ApiService) {}

  getAll(): Observable<Technician[]> {
    return this.api.get<Technician[]>(this.endpoint);
  }

  getActive(): Observable<Technician[]> {
    return this.api.get<Technician[]>(`${this.endpoint}/active`);
  }

  getAvailable(maxWorkOrders = 5): Observable<Technician[]> {
    return this.api.get<Technician[]>(`${this.endpoint}/available?maxWorkOrders=${maxWorkOrders}`);
  }

  getById(id: number): Observable<Technician> {
    return this.api.get<Technician>(`${this.endpoint}/${id}`);
  }

  getBySkill(skillLevel: string): Observable<Technician[]> {
    return this.api.get<Technician[]>(`${this.endpoint}/skill/${skillLevel}`);
  }

  create(data: TechnicianCreateRequest): Observable<Technician> {
    return this.api.post<Technician>(this.endpoint, data);
  }

  update(id: number, data: TechnicianCreateRequest): Observable<Technician> {
    return this.api.put<Technician>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
