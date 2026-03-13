import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, CustomerCreateRequest } from '../models/customer';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private endpoint = '/customers';

  constructor(private api: ApiService) {}

  getAll(): Observable<Customer[]> {
    return this.api.get<Customer[]>(this.endpoint);
  }

  getActive(): Observable<Customer[]> {
    return this.api.get<Customer[]>(`${this.endpoint}/active`);
  }

  getByCompany(companyId: number): Observable<Customer[]> {
    return this.api.get<Customer[]>(`${this.endpoint}/company/${companyId}`);
  }

  getById(id: number): Observable<Customer> {
    return this.api.get<Customer>(`${this.endpoint}/${id}`);
  }

  create(data: CustomerCreateRequest): Observable<Customer> {
    return this.api.post<Customer>(this.endpoint, data);
  }

  update(id: number, data: CustomerCreateRequest): Observable<Customer> {
    return this.api.put<Customer>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
