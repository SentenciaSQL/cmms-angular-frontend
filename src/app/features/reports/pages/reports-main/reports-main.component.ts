import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../../../core/services/reports.service';
import { MonthlyReport, TechnicianPerformance, AssetMaintenanceHistory } from '../../../../core/models/report';
import { AssetsService } from '../../../../core/services/assets.service';
import { Asset } from '../../../../core/models/asset';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

type Tab = 'monthly' | 'technicians' | 'asset';

@Component({
  selector: 'app-reports-main',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './reports-main.component.html',
  styleUrl: './reports-main.component.css'
})
export class ReportsMainComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private assetsService  = inject(AssetsService);

  activeTab: Tab = 'monthly';

  // ── Monthly ──────────────────────────────────────────────────
  selectedMonth: string = this.currentYearMonth();
  monthlyReport: MonthlyReport | null = null;
  loadingMonthly  = false;
  exportingPdf    = false;
  exportingExcel  = false;
  monthlyError: string | null = null;

  // ── Technicians ───────────────────────────────────────────────
  technicians: TechnicianPerformance[] = [];
  loadingTechs    = false;
  exportingTechs  = false;
  techsError: string | null = null;
  techsLoaded     = false;

  // ── Asset History ─────────────────────────────────────────────
  assets: Asset[] = [];
  selectedAssetId: number | null = null;
  assetHistory: AssetMaintenanceHistory[] = [];
  loadingHistory     = false;
  exportingHistory   = false;
  historyError: string | null = null;
  historyLoaded      = false;

  ngOnInit(): void {
    this.loadMonthly();
    this.loadAssets();
  }

  // Helpers
  currentYearMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
    if (tab === 'technicians' && !this.techsLoaded) this.loadTechnicians();
  }

  // ── Monthly ──────────────────────────────────────────────────
  loadMonthly(): void {
    this.loadingMonthly = true;
    this.monthlyError   = null;
    this.reportsService.getMonthlyReport(this.selectedMonth).subscribe({
      next: (r) => { this.monthlyReport = r; this.loadingMonthly = false; },
      error: () => { this.monthlyError = 'Error al cargar el reporte mensual'; this.loadingMonthly = false; }
    });
  }

  exportPdf(): void {
    this.exportingPdf = true;
    this.reportsService.exportMonthlyPdf(this.selectedMonth).subscribe({
      next: (blob) => {
        this.reportsService.downloadBlob(blob, `reporte-mensual-${this.selectedMonth}.pdf`);
        this.exportingPdf = false;
      },
      error: () => { alert('Error al exportar PDF'); this.exportingPdf = false; }
    });
  }

  exportExcel(): void {
    this.exportingExcel = true;
    this.reportsService.exportMonthlyExcel(this.selectedMonth).subscribe({
      next: (blob) => {
        this.reportsService.downloadBlob(blob, `reporte-mensual-${this.selectedMonth}.xlsx`);
        this.exportingExcel = false;
      },
      error: () => { alert('Error al exportar Excel'); this.exportingExcel = false; }
    });
  }

  get completionRate(): number {
    if (!this.monthlyReport?.totalWorkOrders) return 0;
    return Math.round((this.monthlyReport.completedWorkOrders / this.monthlyReport.totalWorkOrders) * 100);
  }

  get priorityEntries(): { key: string; value: number }[] {
    if (!this.monthlyReport?.workOrdersByPriority) return [];
    return Object.entries(this.monthlyReport.workOrdersByPriority)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  get technicianEntries(): { key: string; value: number }[] {
    if (!this.monthlyReport?.workOrdersByTechnician) return [];
    return Object.entries(this.monthlyReport.workOrdersByTechnician)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }

  getPriorityBadge(priority: string): string {
    const map: Record<string, string> = {
      URGENT: 'bg-red-100 text-red-700',
      HIGH:   'bg-orange-100 text-orange-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW:    'bg-blue-100 text-blue-700'
    };
    return map[priority] ?? 'bg-gray-100 text-gray-600';
  }

  // ── Technicians ───────────────────────────────────────────────
  loadTechnicians(): void {
    this.loadingTechs = true;
    this.techsError   = null;
    this.reportsService.getTechniciansComparison().subscribe({
      next: (data) => { this.technicians = data; this.loadingTechs = false; this.techsLoaded = true; },
      error: () => { this.techsError = 'Error al cargar el comparativo'; this.loadingTechs = false; }
    });
  }

  exportTechsExcel(): void {
    this.exportingTechs = true;
    this.reportsService.exportTechniciansExcel().subscribe({
      next: (blob) => {
        this.reportsService.downloadBlob(blob, 'performance-tecnicos.xlsx');
        this.exportingTechs = false;
      },
      error: () => { alert('Error al exportar'); this.exportingTechs = false; }
    });
  }

  getRateBarColor(rate: number): string {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // ── Asset History ─────────────────────────────────────────────
  loadAssets(): void {
    this.assetsService.getAllPaginated(0, 500).subscribe({
      next: (data) => { this.assets = data.content; }
    });
  }

  loadHistory(): void {
    if (!this.selectedAssetId) return;
    this.loadingHistory = true;
    this.historyError   = null;
    this.reportsService.getAssetMaintenanceHistory(this.selectedAssetId).subscribe({
      next: (data) => { this.assetHistory = data; this.loadingHistory = false; this.historyLoaded = true; },
      error: () => { this.historyError = 'Error al cargar el historial'; this.loadingHistory = false; }
    });
  }

  exportHistoryPdf(): void {
    if (!this.selectedAssetId) return;
    this.exportingHistory = true;
    this.reportsService.exportAssetHistoryPdf(this.selectedAssetId).subscribe({
      next: (blob) => {
        this.reportsService.downloadBlob(blob, `historial-activo-${this.selectedAssetId}.pdf`);
        this.exportingHistory = false;
      },
      error: () => { alert('Error al exportar PDF'); this.exportingHistory = false; }
    });
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      COMPLETED:   'bg-green-100 text-green-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      OPEN:        'bg-gray-100 text-gray-700',
      CANCELLED:   'bg-red-100 text-red-700'
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      COMPLETED:   'Completada',
      IN_PROGRESS: 'En Progreso',
      OPEN:        'Abierta',
      CANCELLED:   'Cancelada'
    };
    return map[status] ?? status;
  }

  get selectedAssetName(): string {
    return this.assets.find(a => a.id === Number(this.selectedAssetId))?.name ?? '';
  }
}
