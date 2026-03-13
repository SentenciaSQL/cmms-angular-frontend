import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Asset, AssetCreateRequest, AssetFilterRequest, PaginatedAssets } from '../models/asset';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private endpoint = '/assets';

  constructor(private api: ApiService) {}

  getAllPaginated(page = 0, size = 20, sortBy = 'name', sortDirection = 'ASC'): Observable<PaginatedAssets> {
    return this.api.get<PaginatedAssets>(
      `${this.endpoint}/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
  }

  filter(filter: AssetFilterRequest): Observable<PaginatedAssets> {
    return this.api.post<PaginatedAssets>(`${this.endpoint}/filter`, filter);
  }

  search(query: string, page = 0, size = 20): Observable<PaginatedAssets> {
    return this.api.get<PaginatedAssets>(
      `${this.endpoint}/search/paginated?query=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );
  }

  getById(id: number): Observable<Asset> {
    return this.api.get<Asset>(`${this.endpoint}/${id}`);
  }

  create(data: AssetCreateRequest): Observable<Asset> {
    return this.api.post<Asset>(this.endpoint, data);
  }

  update(id: number, data: AssetCreateRequest): Observable<Asset> {
    return this.api.put<Asset>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
