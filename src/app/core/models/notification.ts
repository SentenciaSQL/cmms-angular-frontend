export interface Notification {
  id: number;
  user: NotificationUser;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  link?: string;
  relatedEntityId?: number;
  createdAt: string;
  readAt?: string;
}

export interface NotificationCreateRequest {
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  link?: string;
  relatedEntityId?: number;
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum NotificationCategory {
  WORK_ORDER = 'WORK_ORDER',
  MAINTENANCE = 'MAINTENANCE',
  INVENTORY = 'INVENTORY',
  ASSET = 'ASSET',
  SYSTEM = 'SYSTEM',
  USER = 'USER'
}

interface NotificationUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}
