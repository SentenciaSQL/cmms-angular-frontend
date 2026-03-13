import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../../core/services/assets.service';
import { Asset } from '../../../../core/models/asset';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './asset-detail.component.html',
  styleUrl: './asset-detail.component.css'
})
export class AssetDetailComponent implements OnInit {
  private assetsService = inject(AssetsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  asset: Asset | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadAsset(id);
  }

  loadAsset(id: number): void {
    this.loading = true;
    this.assetsService.getById(id).subscribe({
      next: (data) => { this.asset = data; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar el activo'; this.loading = false; }
    });
  }

  navigateBack(): void   { this.router.navigate(['/assets/list']); }
  navigateToEdit(): void { if (this.asset) this.router.navigate(['/assets/edit', this.asset.id]); }
  navigateToWO(): void   { this.router.navigate(['/work-orders/list']); }
}
