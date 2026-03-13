import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetsService } from '../../../../core/services/assets.service';
import { Asset, PaginatedAssets } from '../../../../core/models/asset';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.css'
})
export class AssetListComponent implements OnInit {
  private assetsService = inject(AssetsService);
  private router = inject(Router);

  assets: Asset[] = [];
  loading = true;
  error: string | null = null;

  searchQuery = '';
  filterActive: boolean | undefined = undefined;
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  readonly activeOptions = [
    { value: undefined, label: 'Todos' },
    { value: true,      label: 'Activos' },
    { value: false,     label: 'Inactivos' }
  ];

  selectedActiveLabel = 'Todos';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    const request$ = this.searchQuery.trim()
      ? this.assetsService.search(this.searchQuery, this.currentPage, this.pageSize)
      : this.assetsService.filter({
          isActive: this.filterActive,
          page: this.currentPage,
          size: this.pageSize,
          sortBy: 'name',
          sortDirection: 'ASC'
        });

    request$.subscribe({
      next: (data: PaginatedAssets) => {
        this.assets = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los activos';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.load();
  }

  setActiveFilter(value: boolean | undefined, label: string): void {
    this.filterActive = value;
    this.selectedActiveLabel = label;
    this.searchQuery = '';
    this.currentPage = 0;
    this.load();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.load();
  }

  navigateToCreate(): void  { this.router.navigate(['/assets/create']); }
  navigateToDetail(id: number): void { this.router.navigate(['/assets/detail', id]); }
  navigateToEdit(id: number): void   { this.router.navigate(['/assets/edit', id]); }

  deleteAsset(id: number): void {
    if (confirm('¿Estás seguro de eliminar este activo?')) {
      this.assetsService.delete(id).subscribe({
        next: () => this.load(),
        error: () => alert('Error al eliminar el activo')
      });
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
