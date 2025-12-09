import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintenancePlansService} from '../../../../core/services/maintenance-plans.service';
import {Router} from '@angular/router';
import {MaintenancePlan} from '../../../../core/models/maintenance-plan';
import {PageBreadcrumbComponent} from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-plan-list',
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './plan-list.component.html',
  styleUrl: './plan-list.component.css',
  standalone: true,
})
export class PlanListComponent implements OnInit{
  private maintenancePlanService = inject(MaintenancePlansService);
  private router = inject(Router);

  plans: MaintenancePlan[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading = true;
    this.error = null;

    this.maintenancePlanService.getAll().subscribe({
      next: (data) => {
        this.plans = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los planes de mantenimiento';
        this.loading = false;
        console.error(err);
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/maintenance-plans/create']);
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/maintenance-plans/detail', id]);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/maintenance-plans/edit', id]);
  }

  deletePlan(id: number): void {
    if (confirm('¿Estás seguro de eliminar este plan?')) {
      this.maintenancePlanService.delete(id).subscribe({
        next: () => {
          this.loadPlans();
        },
        error: (err) => {
          alert('Error al eliminar el plan');
          console.error(err);
        }
      });
    }
  }

  executePlan(id: number): void {
    if (confirm('¿Generar orden de trabajo para este plan?')) {
      this.maintenancePlanService.execute(id).subscribe({
        next: () => {
          alert('Orden de trabajo generada exitosamente');
          this.loadPlans();
        },
        error: (err) => {
          alert('Error al ejecutar el plan');
          console.error(err);
        }
      });
    }
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      'LOW': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      'MEDIUM': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'HIGH': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'CRITICAL': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'PREVENTIVE': 'Preventivo',
      'PREDICTIVE': 'Predictivo',
      'CORRECTIVE': 'Correctivo'
    };
    return labels[type] || type;
  }

  getFrequencyLabel(frequency: string, value: number): string {
    const labels: Record<string, string> = {
      'DAILY': 'día(s)',
      'WEEKLY': 'semana(s)',
      'MONTHLY': 'mes(es)',
      'QUARTERLY': 'trimestre(s)',
      'YEARLY': 'año(s)'
    };
    return `Cada ${value} ${labels[frequency] || frequency}`;
  }
}
