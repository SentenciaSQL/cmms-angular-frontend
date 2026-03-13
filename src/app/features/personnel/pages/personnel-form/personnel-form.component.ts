import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TechniciansService } from '../../../../core/services/technicians.service';
import { Technician, TechnicianCreateRequest, SKILL_LEVELS } from '../../../../core/models/technician';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-personnel-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './personnel-form.component.html',
  styleUrl: './personnel-form.component.css'
})
export class PersonnelFormComponent implements OnInit {
  private techService = inject(TechniciansService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  techId: number | null = null;
  loading = false;
  loadingData = false;
  error: string | null = null;

  readonly skillLevels = SKILL_LEVELS;

  form: TechnicianCreateRequest & { isActive: boolean } = {
    userId: 0,
    skillLevel: '',
    hourlyRate: undefined,
    phoneAlt: '',
    notes: '',
    isActive: true
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.techId = Number(id);
      this.loadTech(this.techId);
    }
  }

  loadTech(id: number): void {
    this.loadingData = true;
    this.techService.getById(id).subscribe({
      next: (t: Technician) => {
        this.form = {
          userId:     t.userId,
          skillLevel: t.skillLevel || '',
          hourlyRate: t.hourlyRate,
          phoneAlt:   t.phoneAlt || '',
          notes:      t.notes || '',
          isActive:   t.isActive
        };
        this.loadingData = false;
      },
      error: () => { this.error = 'No se pudo cargar el técnico'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.userId) { this.error = 'El ID de usuario es requerido'; return; }

    this.loading = true;
    this.error = null;

    const payload: any = {
      ...this.form,
      skillLevel: this.form.skillLevel || undefined,
      phoneAlt:   this.form.phoneAlt   || undefined,
      notes:      this.form.notes      || undefined,
      hourlyRate: this.form.hourlyRate  || undefined
    };

    const req$ = this.isEditMode && this.techId
      ? this.techService.update(this.techId, payload)
      : this.techService.create(payload);

    req$.subscribe({
      next: (t: Technician) => { this.loading = false; this.router.navigate(['/personnel/detail', t.id]); },
      error: (err) => { this.error = err?.error?.message || 'Error al guardar'; this.loading = false; }
    });
  }

  onCancel(): void {
    this.isEditMode && this.techId
      ? this.router.navigate(['/personnel/detail', this.techId])
      : this.router.navigate(['/personnel/list']);
  }
}
