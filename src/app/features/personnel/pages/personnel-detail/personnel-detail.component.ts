import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TechniciansService } from '../../../../core/services/technicians.service';
import { Technician, SKILL_LEVELS } from '../../../../core/models/technician';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-personnel-detail',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './personnel-detail.component.html',
  styleUrl: './personnel-detail.component.css'
})
export class PersonnelDetailComponent implements OnInit {
  private techService = inject(TechniciansService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tech: Technician | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.techService.getById(id).subscribe({
      next: (data) => { this.tech = data; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar el técnico'; this.loading = false; }
    });
  }

  getFullName(): string {
    if (!this.tech) return '';
    return [this.tech.userFirstName, this.tech.userLastName].filter(Boolean).join(' ') || this.tech.userName || '—';
  }

  getInitials(): string {
    if (!this.tech) return '?';
    const f = this.tech.userFirstName?.charAt(0) || '';
    const l = this.tech.userLastName?.charAt(0)  || '';
    return (f + l).toUpperCase() || this.tech.userName?.charAt(0).toUpperCase() || '?';
  }

  getAvatarColor(): string {
    if (!this.tech) return 'bg-gray-500';
    const colors = ['bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500','bg-pink-500','bg-teal-500'];
    return colors[this.tech.id % colors.length];
  }

  getSkillLabel(): string {
    return SKILL_LEVELS.find(s => s.value === this.tech?.skillLevel)?.label || this.tech?.skillLevel || '—';
  }

  getSkillBadge(): string {
    const map: Record<string, string> = {
      junior: 'bg-gray-100 text-gray-700',
      semi:   'bg-blue-100 text-blue-700',
      senior: 'bg-purple-100 text-purple-700'
    };
    return map[this.tech?.skillLevel || ''] || 'bg-gray-100 text-gray-600';
  }

  get completionRate(): number {
    if (!this.tech?.assignedWorkOrders || !this.tech?.completedWorkOrders) return 0;
    return Math.round((this.tech.completedWorkOrders / this.tech.assignedWorkOrders) * 100);
  }

  navigateBack(): void   { this.router.navigate(['/personnel/list']); }
  navigateToEdit(): void { if (this.tech) this.router.navigate(['/personnel/edit', this.tech.id]); }
}
