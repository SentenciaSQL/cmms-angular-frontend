import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MaintenancePlansService} from '../../../../core/services/maintenance-plans.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PageBreadcrumbComponent} from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {MaintenancePlanCreateRequest} from '../../../../core/models/maintenance-plan';
import {AlertComponent} from '../../../../shared/components/ui/alert/alert.component';
import {TranslatePipe} from '../../../../shared/pipes/translate-pipe';
import {LabelComponent} from '../../../../shared/components/forms/label/label.component';
import {InputFieldComponent} from '../../../../shared/components/forms/input/input-field.component';
import {FormValidationHelper} from '../../../../core/constants/form-validation.helper';
import {TranslationService} from '../../../../shared/services/translation.service';
import {BOX_ICON} from '../../../../core/constants/buttons-constans';
import {SelectComponent} from '../../../../shared/components/forms/select/select.component';
import {TextAreaComponent} from '../../../../shared/components/forms/input/text-area.component';
import {ButtonComponent} from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageBreadcrumbComponent, AlertComponent, TranslatePipe, LabelComponent, InputFieldComponent, SelectComponent, TextAreaComponent, ButtonComponent],
  templateUrl: './plan-form.component.html',
  styleUrl: './plan-form.component.css',
})
export class PlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private maintenancePlanService = inject(MaintenancePlansService);
  private translation = inject(TranslationService);

  planForm!: FormGroup;
  isEditMode = false;
  planId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  description = '';
  selectedValue = '';

  boxIcon = BOX_ICON;

  // Options para los selects
  typeOptions = [
    { value: 'PREVENTIVE', label: 'Preventivo' },
    { value: 'PREDICTIVE', label: 'Predictivo' },
    { value: 'CORRECTIVE', label: 'Correctivo' }
  ];

  frequencyOptions = [
    { value: 'DAILY', label: 'Diario' },
    { value: 'WEEKLY', label: 'Semanal' },
    { value: 'MONTHLY', label: 'Mensual' },
    { value: 'QUARTERLY', label: 'Trimestral' },
    { value: 'YEARLY', label: 'Anual' }
  ];

  priorityOptions = [
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'CRITICAL', label: 'Crítica' }
  ];

  // Mock data - Reemplazar con servicios reales
  assets = [
    { label: 'Motor Eléctrico A1', value: 'MOT-001' },
    { label: 'Bomba Hidráulica B2', value: 'BOM-002' },
    { label: 'Compresor C3', value: 'COM-003' }
  ];

  // assets = [
  //   { value: 'marketing', label: 'Marketing' },
  //   { value: 'template', label: 'Template' },
  //   { value: 'development', label: 'Development' },
  // ];

  technicians = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María López' },
    { id: 3, name: 'Carlos García' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.planForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      assetId: [null, Validators.required],
      type: ['PREVENTIVE', Validators.required],
      frequency: ['MONTHLY', Validators.required],
      frequencyValue: [1, [Validators.required, Validators.min(1), Validators.max(365)]],
      nextScheduledDate: ['', Validators.required],
      estimatedDurationMinutes: [60, [Validators.required, Validators.min(1)]],
      priority: ['MEDIUM', Validators.required],
      instructions: ['', Validators.maxLength(2000)],
      assignedTechnicianId: [null],
      autoGenerateWorkOrder: [false]
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.planId = +params['id'];
        this.loadPlan(this.planId);
      }
    });
  }

  loadPlan(id: number): void {
    this.loading = true;
    this.maintenancePlanService.getById(id).subscribe({
      next: (plan) => {
        this.planForm.patchValue({
          name: plan.name,
          description: plan.description,
          assetId: plan.asset?.id,
          type: plan.type,
          frequency: plan.frequency,
          frequencyValue: plan.frequencyValue,
          nextScheduledDate: this.formatDateForInput(plan.nextScheduledDate),
          estimatedDurationMinutes: plan.estimatedDurationMinutes,
          priority: plan.priority,
          instructions: plan.instructions,
          assignedTechnicianId: plan.assignedTechnician?.id,
          autoGenerateWorkOrder: plan.autoGenerateWorkOrder
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el plan';
        this.loading = false;
        console.error(err);
      }
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // formato: YYYY-MM-DDTHH:mm
  }

  handleSelectChange(value: string) {
    this.selectedValue = value;
    console.log('Selected value:', value);
  }

  onSubmit(): void {
    if (this.planForm.invalid) {
      this.markFormGroupTouched(this.planForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.planForm.value;
    const planData: MaintenancePlanCreateRequest = {
      name: formValue.name,
      description: formValue.description || undefined,
      assetId: formValue.assetId,
      type: formValue.type,
      frequency: formValue.frequency,
      frequencyValue: formValue.frequencyValue,
      nextScheduledDate: formValue.nextScheduledDate,
      estimatedDurationMinutes: formValue.estimatedDurationMinutes,
      priority: formValue.priority,
      instructions: formValue.instructions || undefined,
      assignedTechnicianId: formValue.assignedTechnicianId || undefined,
      autoGenerateWorkOrder: formValue.autoGenerateWorkOrder
    };

    if (this.isEditMode && this.planId) {
      this.updatePlan(planData);
    } else {
      this.createPlan(planData);
    }
  }

  createPlan(data: MaintenancePlanCreateRequest): void {
    this.maintenancePlanService.create(data).subscribe({
      next: (response) => {
        console.log('Plan creado:', response);
        this.router.navigate(['/maintenance-plans/list']);
      },
      error: (err) => {
        this.error = 'Error al crear el plan. Por favor intenta nuevamente.';
        this.submitting = false;
        console.error(err);
      }
    });
  }

  updatePlan(data: MaintenancePlanCreateRequest): void {
    if (!this.planId) return;

    this.maintenancePlanService.update(this.planId, data).subscribe({
      next: (response) => {
        console.log('Plan actualizado:', response);
        this.router.navigate(['/maintenance-plans/list']);
      },
      error: (err) => {
        this.error = 'Error al actualizar el plan. Por favor intenta nuevamente.';
        this.submitting = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/maintenance-plans/list']);
  }

  // Helpers para validación
  isFieldInvalid(fieldName: string): boolean {
    const field = this.planForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.planForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
    if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;

    return 'Campo inválido';
  }

  isInvalid(controlName: string): boolean {
    return FormValidationHelper.isInvalid(
      this.planForm,
      controlName,
      this.submitting
    );
  }

  get nameHint(): string | undefined {
    return FormValidationHelper.getErrorMessage(
      this.planForm,
      'name',
      {
        required: this.translation.translate('auth.errors.usernameRequired'),
      },
      this.submitting
    );
  }

  get assetsHint(): string | undefined {
    return FormValidationHelper.getErrorMessage(
      this.planForm,
      'assetId',
      {
        required: 'El activo es obligatorio',
      },
      this.submitting
    );
  }


  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
