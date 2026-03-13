import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TechniciansService } from '../../../../core/services/technicians.service';
import { Technician, SKILL_LEVELS } from '../../../../core/models/technician';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-personnel-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './personnel-list.component.html',
  styleUrl: './personnel-list.component.css'
})
export class PersonnelListComponent implements OnInit {
  private techService = inject(TechniciansService);
  private router = inject(Router);

  technicians: Technician[] = [];
  filtered: Technician[] = [];
  loading = true;
  error: string | null = null;

  searchQuery = '';
  filterStatus: 'all' | 'active' | 'available' = 'all';
  filterSkill = '';

  readonly skillLevels = SKILL_LEVELS;

  readonly statusOptions: { v: 'all' | 'active' | 'available'; l: string }[] = [
    { v: 'all',       l: 'Todos' },
    { v: 'active',    l: 'Activos' },
    { v: 'available', l: 'Disponibles' }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = null;

    const req$ = this.filterStatus === 'available'
      ? this.techService.getAvailable()
      : this.filterStatus === 'active'
        ? this.techService.getActive()
        : this.techService.getAll();

    req$.subscribe({
      next: (data) => {
        this.technicians = data;
        this.applyLocalFilters();
        this.loading = false;
      },
      error: () => { this.error = 'Error al cargar técnicos'; this.loading = false; }
    });
  }

  applyLocalFilters(): void {
    let result = [...this.technicians];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(t =>
        (t.userFirstName + ' ' + t.userLastName).toLowerCase().includes(q) ||
        t.userEmail?.toLowerCase().includes(q) ||
        t.userName?.toLowerCase().includes(q)
      );
    }

    if (this.filterSkill) {
      result = result.filter(t => t.skillLevel === this.filterSkill);
    }

    this.filtered = result;
  }

  onSearch(): void { this.applyLocalFilters(); }
  onSkillChange(): void { this.applyLocalFilters(); }

  setStatusFilter(f: 'all' | 'active' | 'available'): void {
    this.filterStatus = f;
    this.searchQuery = '';
    this.filterSkill = '';
    this.load();
  }

  navigateToCreate(): void           { this.router.navigate(['/personnel/create']); }
  navigateToDetail(id: number): void { this.router.navigate(['/personnel/detail', id]); }
  navigateToEdit(id: number): void   { this.router.navigate(['/personnel/edit', id]); }

  deleteTechnician(id: number): void {
    if (confirm('¿Estás seguro de eliminar este técnico?')) {
      this.techService.delete(id).subscribe({
        next: () => this.load(),
        error: () => alert('Error al eliminar el técnico')
      });
    }
  }

  getFullName(t: Technician): string {
    return [t.userFirstName, t.userLastName].filter(Boolean).join(' ') || t.userName || '—';
  }

  getInitials(t: Technician): string {
    const first = t.userFirstName?.charAt(0) || '';
    const last  = t.userLastName?.charAt(0)  || '';
    return (first + last).toUpperCase() || t.userName?.charAt(0).toUpperCase() || '?';
  }

  getAvatarColor(id: number): string {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500',
      'bg-orange-500', 'bg-pink-500', 'bg-teal-500'
    ];
    return colors[id % colors.length];
  }

  getSkillLabel(level?: string): string {
    return SKILL_LEVELS.find(s => s.value === level)?.label || level || '—';
  }

  getSkillBadge(level?: string): string {
    const map: Record<string, string> = {
      junior: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      semi:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      senior: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    };
    return map[level || ''] || 'bg-gray-100 text-gray-600';
  }
}
