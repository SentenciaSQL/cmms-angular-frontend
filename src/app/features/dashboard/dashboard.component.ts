import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  stats: DashboardStats | null = null;
  loading = true;
  error: string | null = null;
  lastUpdated: Date | null = null;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.lastUpdated = new Date();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las estadísticas';
        this.loading = false;
      }
    });
  }

  // Completion rate
  get completionRate(): number {
    if (!this.stats || !this.stats.totalWorkOrders) return 0;
    return Math.round((this.stats.completedWorkOrders / this.stats.totalWorkOrders) * 100);
  }

  // Technician availability rate
  get techAvailabilityRate(): number {
    if (!this.stats || !this.stats.totalTechnicians) return 0;
    return Math.round((this.stats.availableTechnicians / this.stats.totalTechnicians) * 100);
  }

  // Priority bar width %
  priorityPercent(count: number): number {
    if (!this.stats || !this.stats.totalWorkOrders) return 0;
    return Math.round((count / this.stats.totalWorkOrders) * 100);
  }

  formatCost(value: number | null): string {
    if (value == null) return '—';
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  formatHours(value: number | null): string {
    if (value == null) return '—';
    return value.toFixed(1) + ' hrs';
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
