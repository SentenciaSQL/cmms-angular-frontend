import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService } from '../../core/services/notifications.service';
import { AuthService } from '../../core/services/auth.service';
import { Notification, NotificationType, NotificationCategory } from '../../core/models/notification';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  private notifService = inject(NotificationsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  notifications: Notification[] = [];
  loading = true;
  error: string | null = null;
  filter: 'all' | 'unread' = 'all';
  userId: number | null = null;
  deletingRead = false;

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    if (this.userId) this.load();
    else { this.error = 'No se pudo obtener el usuario actual'; this.loading = false; }
  }

  load(): void {
    if (!this.userId) return;
    this.loading = true;
    this.error = null;
    const req$ = this.filter === 'unread'
      ? this.notifService.getUnread(this.userId)
      : this.notifService.getByUser(this.userId);

    req$.subscribe({
      next: (data) => { this.notifications = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar notificaciones'; this.loading = false; }
    });
  }

  setFilter(f: 'all' | 'unread'): void {
    this.filter = f;
    this.load();
  }

  markAsRead(notif: Notification, event: Event): void {
    event.stopPropagation();
    if (notif.isRead) return;
    this.notifService.markAsRead(notif.id).subscribe({
      next: (updated) => {
        const idx = this.notifications.findIndex(n => n.id === notif.id);
        if (idx !== -1) this.notifications[idx] = updated;
      }
    });
  }

  markAllRead(): void {
    if (!this.userId) return;
    this.notifService.markAllRead(this.userId).subscribe({
      next: () => this.load()
    });
  }

  deleteNotif(id: number, event: Event): void {
    event.stopPropagation();
    this.notifService.delete(id).subscribe({
      next: () => { this.notifications = this.notifications.filter(n => n.id !== id); }
    });
  }

  deleteAllRead(): void {
    if (!this.userId || this.deletingRead) return;
    this.deletingRead = true;
    this.notifService.deleteRead(this.userId).subscribe({
      next: () => { this.deletingRead = false; this.load(); },
      error: () => { this.deletingRead = false; }
    });
  }

  handleClick(notif: Notification): void {
    if (!notif.isRead) this.notifService.markAsRead(notif.id).subscribe({
      next: (updated) => {
        const idx = this.notifications.findIndex(n => n.id === notif.id);
        if (idx !== -1) this.notifications[idx] = updated;
      }
    });
    if (notif.link) this.router.navigateByUrl(notif.link);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getTypeIcon(type: NotificationType): string {
    const map: Record<string, string> = {
      INFO:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      WARNING: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      ERROR:   'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      SUCCESS: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return map[type] || map['INFO'];
  }

  getTypeColor(type: NotificationType): string {
    const map: Record<string, string> = {
      INFO:    'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      WARNING: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
      ERROR:   'text-red-500 bg-red-100 dark:bg-red-900/30',
      SUCCESS: 'text-green-500 bg-green-100 dark:bg-green-900/30'
    };
    return map[type] || map['INFO'];
  }

  getCategoryLabel(category: NotificationCategory): string {
    const map: Record<string, string> = {
      WORK_ORDER:  'Orden de Trabajo',
      MAINTENANCE: 'Mantenimiento',
      INVENTORY:   'Inventario',
      ASSET:       'Activo',
      SYSTEM:      'Sistema',
      USER:        'Usuario'
    };
    return map[category] || category;
  }

  getCategoryBadge(category: NotificationCategory): string {
    const map: Record<string, string> = {
      WORK_ORDER:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      MAINTENANCE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      INVENTORY:   'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      ASSET:       'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
      SYSTEM:      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      USER:        'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
    };
    return map[category] || map['SYSTEM'];
  }
}
