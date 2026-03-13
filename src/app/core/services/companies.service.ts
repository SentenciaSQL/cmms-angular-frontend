import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company, CompanyCreateRequest, Site, SiteCreateRequest } from '../models/company';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private companiesEndpoint = '/companies';
  private sitesEndpoint     = '/sites';

  constructor(private api: ApiService) {}

  // Companies
  getAllCompanies(): Observable<Company[]> {
    return this.api.get<Company[]>(this.companiesEndpoint);
  }

  getActiveCompanies(): Observable<Company[]> {
    return this.api.get<Company[]>(`${this.companiesEndpoint}/active`);
  }

  getCompanyById(id: number): Observable<Company> {
    return this.api.get<Company>(`${this.companiesEndpoint}/${id}`);
  }

  createCompany(data: CompanyCreateRequest): Observable<Company> {
    return this.api.post<Company>(this.companiesEndpoint, data);
  }

  updateCompany(id: number, data: CompanyCreateRequest): Observable<Company> {
    return this.api.put<Company>(`${this.companiesEndpoint}/${id}`, data);
  }

  deleteCompany(id: number): Observable<void> {
    return this.api.delete<void>(`${this.companiesEndpoint}/${id}`);
  }

  // Sites
  getAllSites(): Observable<Site[]> {
    return this.api.get<Site[]>(this.sitesEndpoint);
  }

  getSitesByCompany(companyId: number): Observable<Site[]> {
    return this.api.get<Site[]>(`${this.sitesEndpoint}/company/${companyId}`);
  }

  getSiteById(id: number): Observable<Site> {
    return this.api.get<Site>(`${this.sitesEndpoint}/${id}`);
  }

  createSite(data: SiteCreateRequest): Observable<Site> {
    return this.api.post<Site>(this.sitesEndpoint, data);
  }

  updateSite(id: number, data: SiteCreateRequest): Observable<Site> {
    return this.api.put<Site>(`${this.sitesEndpoint}/${id}`, data);
  }

  deleteSite(id: number): Observable<void> {
    return this.api.delete<void>(`${this.sitesEndpoint}/${id}`);
  }
}
