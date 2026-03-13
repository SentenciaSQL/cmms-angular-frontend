import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../../core/services/assets.service';
import { Asset, AssetCreateRequest } from '../../../../core/models/asset';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './asset-form.component.html',
  styleUrl: './asset-form.component.css'
})
export class AssetFormComponent implements OnInit {
  private assetsService = inject(AssetsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  assetId: number | null = null;
  loading = false;
  loadingData = false;
  error: string | null = null;

  form: AssetCreateRequest & { isActive?: boolean } = {
    siteId: 0,
    categoryId: undefined,
    code: '',
    name: '',
    description: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    installedAt: '',
    isActive: true
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.assetId = Number(id);
      this.loadAsset(this.assetId);
    }
  }

  loadAsset(id: number): void {
    this.loadingData = true;
    this.assetsService.getById(id).subscribe({
      next: (asset: Asset) => {
        this.form = {
          siteId:       asset.siteId,
          categoryId:   asset.categoryId,
          code:         asset.code,
          name:         asset.name,
          description:  asset.description || '',
          serialNumber: asset.serialNumber || '',
          manufacturer: asset.manufacturer || '',
          model:        asset.model || '',
          installedAt:  asset.installedAt ? asset.installedAt.substring(0, 10) : '',
          isActive:     asset.isActive
        };
        this.loadingData = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el activo';
        this.loadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.form.name.trim()) { this.error = 'El nombre es requerido'; return; }
    if (!this.form.code.trim()) { this.error = 'El código es requerido'; return; }
    if (!this.form.siteId)      { this.error = 'El ID de sitio es requerido'; return; }

    this.loading = true;
    this.error = null;

    const payload: any = {
      ...this.form,
      description:  this.form.description  || undefined,
      serialNumber: this.form.serialNumber || undefined,
      manufacturer: this.form.manufacturer || undefined,
      model:        this.form.model        || undefined,
      installedAt:  this.form.installedAt  || undefined,
      categoryId:   this.form.categoryId   || undefined
    };

    const request$ = this.isEditMode && this.assetId
      ? this.assetsService.update(this.assetId, payload)
      : this.assetsService.create(payload);

    request$.subscribe({
      next: (asset: Asset) => {
        this.loading = false;
        this.router.navigate(['/assets/detail', asset.id]);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al guardar el activo';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.assetId) {
      this.router.navigate(['/assets/detail', this.assetId]);
    } else {
      this.router.navigate(['/assets/list']);
    }
  }
}
