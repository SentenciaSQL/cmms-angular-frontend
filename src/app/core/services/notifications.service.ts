import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notification, NotificationCreateRequest } from '../models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private endpoint = '/notifications';

  constructor(private api: ApiService) {}

  getByUser(userId: number): Observable<Notification[]> {
    return this.api.get<Notification[]>(`${this.endpoint}/user/${userId}`);
  }

  getUnread(userId: number): Observable<Notification[]> {
    return this.api.get<Notification[]>(`${this.endpoint}/user/${userId}/unread`);
  }

  countUnread(userId: number): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/user/${userId}/count-unread`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.api.patch<Notification>(`${this.endpoint}/${id}/read`, {});
  }

  markAllRead(userId: number): Observable<void> {
    return this.api.patch<void>(`${this.endpoint}/user/${userId}/mark-all-read`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  deleteRead(userId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/user/${userId}/read`);
  }

  create(data: NotificationCreateRequest): Observable<Notification> {
    return this.api.post<Notification>(this.endpoint, data);
  }
}
