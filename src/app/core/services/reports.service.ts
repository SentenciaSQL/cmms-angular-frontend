import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MonthlyReport, TechnicianPerformance, AssetMaintenanceHistory } from '../models/report';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private base = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('cmms_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Data
  getMonthlyReport(month: string): Observable<MonthlyReport> {
    return this.http.get<MonthlyReport>(`${this.base}/monthly?month=${month}`, { headers: this.headers });
  }

  getCurrentMonthReport(): Observable<MonthlyReport> {
    return this.http.get<MonthlyReport>(`${this.base}/monthly/current`, { headers: this.headers });
  }

  getTechnicianPerformance(id: number): Observable<TechnicianPerformance> {
    return this.http.get<TechnicianPerformance>(`${this.base}/technician/${id}/performance`, { headers: this.headers });
  }

  getTechniciansComparison(): Observable<TechnicianPerformance[]> {
    return this.http.get<TechnicianPerformance[]>(`${this.base}/technicians/comparison`, { headers: this.headers });
  }

  getAssetMaintenanceHistory(assetId: number): Observable<AssetMaintenanceHistory[]> {
    return this.http.get<AssetMaintenanceHistory[]>(`${this.base}/asset/${assetId}/maintenance-history`, { headers: this.headers });
  }

  // Exports — devuelven Blob para download
  exportMonthlyPdf(month: string): Observable<Blob> {
    return this.http.get(`${this.base}/monthly/export/pdf?month=${month}`, {
      headers: this.headers, responseType: 'blob'
    });
  }

  exportMonthlyExcel(month: string): Observable<Blob> {
    return this.http.get(`${this.base}/monthly/export/excel?month=${month}`, {
      headers: this.headers, responseType: 'blob'
    });
  }

  exportTechniciansExcel(): Observable<Blob> {
    return this.http.get(`${this.base}/technicians/export/excel`, {
      headers: this.headers, responseType: 'blob'
    });
  }

  exportAssetHistoryPdf(assetId: number): Observable<Blob> {
    return this.http.get(`${this.base}/asset/${assetId}/maintenance-history/export/pdf`, {
      headers: this.headers, responseType: 'blob'
    });
  }

  // Helper: dispara download del blob en el navegador
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
