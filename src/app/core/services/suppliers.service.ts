import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Supplier, SupplierCreateRequest } from '../models/supplier';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private endpoint = '/suppliers';

  constructor(private api: ApiService) {}

  getAll(): Observable<Supplier[]> {
    return this.api.get<Supplier[]>(this.endpoint);
  }

  getActive(): Observable<Supplier[]> {
    return this.api.get<Supplier[]>(`${this.endpoint}/active`);
  }

  search(query: string): Observable<Supplier[]> {
    return this.api.get<Supplier[]>(`${this.endpoint}/search?query=${encodeURIComponent(query)}`);
  }

  getById(id: number): Observable<Supplier> {
    return this.api.get<Supplier>(`${this.endpoint}/${id}`);
  }

  create(data: SupplierCreateRequest): Observable<Supplier> {
    return this.api.post<Supplier>(this.endpoint, data);
  }

  update(id: number, data: SupplierCreateRequest): Observable<Supplier> {
    return this.api.put<Supplier>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
