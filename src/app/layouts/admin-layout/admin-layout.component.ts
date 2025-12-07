import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {SidebarService} from '../../shared/services/sidebar.service';
import {AppSidebarComponent} from '../app-sidebar/app-sidebar.component';
import {BackdropComponent} from '../backdrop/backdrop.component';
import {AppHeaderComponent} from '../app-header/app-header.component';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, AppSidebarComponent, BackdropComponent, AppHeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  readonly isExpanded$;
  readonly isHovered$;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  get containerClasses() {
    return [
      'flex-1',
      'transition-all',
      'duration-300',
      'ease-in-out',
      (this.isExpanded$ || this.isHovered$) ? 'xl:ml-[290px]' : 'xl:ml-[90px]',
      this.isMobileOpen$ ? 'ml-0' : ''
    ];
  }
}
