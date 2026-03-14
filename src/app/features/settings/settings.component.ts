import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { TranslationService, Language } from '../../shared/services/translation.service';

type Tab = 'profile' | 'security' | 'preferences';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private auth    = inject(AuthService);
  private http    = inject(HttpClient);
  readonly t      = inject(TranslationService);

  activeTab: string = 'profile';

  // Profile
  user: User | null = null;
  userId: number | null = null;
  profileSuccess = false;

  // Avatar
  avatarUrl: string | null = null;
  avatarPreview: string | null = null;
  uploadingAvatar = false;
  uploadAvatarError: string | null = null;

  // Security
  pwForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  pwLoading   = false;
  pwSuccess   = false;
  pwError: string | null = null;
  showCurrent = false;
  showNew     = false;
  showConfirm = false;

  // Preferences
  prefs = {
    language:             'es' as Language,
    emailNotifications:   true,
    browserNotifications: false,
    compactMode:          false,
  };

  get tabs(): { v: Tab; label: string; icon: string }[] {
    return [
      { v: 'profile',     label: this.t.translate('settings.tabs.profile'),     icon: '👤' },
      { v: 'security',    label: this.t.translate('settings.tabs.security'),    icon: '🔒' },
      { v: 'preferences', label: this.t.translate('settings.tabs.preferences'), icon: '⚙️' },
    ];
  }

  ngOnInit(): void {
    this.user   = this.auth.getCurrentUser();
    this.userId = this.auth.getCurrentUserId();
    this.loadPrefs();
    const storedUrl = localStorage.getItem('cmms_avatar');
    if (storedUrl) this.loadAvatarAsBlob(storedUrl);
  }

  setTab(tab: string): void {
    this.activeTab         = tab;
    this.pwSuccess         = false;
    this.pwError           = null;
    this.profileSuccess    = false;
    this.uploadAvatarError = null;
  }

  // ── Translate shortcut ───────────────────────────────────────
  tr(key: string): string { return this.t.translate(key); }

  // ── Avatar ───────────────────────────────────────────────────
  get displayAvatar(): string | null {
    return this.avatarPreview ?? this.avatarUrl;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.uploadAvatarError = 'Solo se permiten imágenes (JPEG, PNG, GIF)';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.uploadAvatarError = 'La imagen no puede superar 5 MB';
      return;
    }
    this.uploadAvatarError = null;

    const reader = new FileReader();
    reader.onload = (e) => { this.avatarPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
    this.uploadAvatar(file);
    input.value = '';
  }

  uploadAvatar(file: File): void {
    this.uploadingAvatar = true;
    const token    = this.auth.getToken();
    const headers  = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ fileName: string; fileUrl: string; fileType: string; fileSize: number; message: string }>(
      `${environment.apiUrl}/files/upload/image`,
      formData,
      { headers }
    ).subscribe({
      next: (res) => {
        const baseUrl = environment.apiUrl.replace(/\/api$/, '');
        const fullUrl = res.fileUrl.startsWith('http') ? res.fileUrl : `${baseUrl}${res.fileUrl}`;
        localStorage.setItem('cmms_avatar', fullUrl);
        this.avatarPreview   = null;
        this.uploadingAvatar = false;
        this.loadAvatarAsBlob(fullUrl);
      },
      error: (err: any) => {
        this.uploadAvatarError = err?.error?.message || 'Error al subir la imagen';
        this.avatarPreview     = null;
        this.uploadingAvatar   = false;
      }
    });
  }

  loadAvatarAsBlob(url: string): void {
    const baseUrl  = environment.apiUrl.replace(/\/api$/, '');
    const fullUrl  = url.startsWith('http') ? url : `${baseUrl}${url}`;
    const token    = this.auth.getToken();
    const headers  = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(fullUrl, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        if (this.avatarUrl?.startsWith('blob:')) URL.revokeObjectURL(this.avatarUrl);
        this.avatarUrl = URL.createObjectURL(blob);
      },
      error: () => { this.avatarUrl = null; }
    });
  }

  removeAvatar(): void {
    if (this.avatarUrl?.startsWith('blob:')) URL.revokeObjectURL(this.avatarUrl);
    this.avatarUrl     = null;
    this.avatarPreview = null;
    localStorage.removeItem('cmms_avatar');
  }

  // ── Profile helpers ──────────────────────────────────────────
  get fullName(): string {
    if (!this.user) return '';
    return [this.user.firstName, this.user.lastName].filter(Boolean).join(' ');
  }

  get initials(): string {
    if (!this.user) return '?';
    return ((this.user.firstName?.[0] ?? '') + (this.user.lastName?.[0] ?? '')).toUpperCase() || '?';
  }

  get roleLabel(): string {
    return this.user?.roles.map(r => this.t.translate(`settings.roles.${r}`) || r).join(', ') ?? '';
  }

  getAvatarColor(): string {
    const colors = ['bg-blue-600','bg-violet-600','bg-teal-600','bg-rose-600','bg-amber-600'];
    return colors[(this.userId ?? 0) % colors.length];
  }

  // ── Security ─────────────────────────────────────────────────
  get pwStrength(): { label: string; color: string; width: number } {
    const p = this.pwForm.newPassword;
    if (!p) return { label: '', color: '', width: 0 };
    let score = 0;
    if (p.length >= 8)            score++;
    if (p.length >= 12)           score++;
    if (/[A-Z]/.test(p))         score++;
    if (/[0-9]/.test(p))         score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const s = this.t.translate.bind(this.t);
    if (score <= 1) return { label: s('settings.security.strength.veryWeak'), color: 'bg-red-500',    width: 20  };
    if (score === 2) return { label: s('settings.security.strength.weak'),     color: 'bg-orange-500', width: 40  };
    if (score === 3) return { label: s('settings.security.strength.fair'),     color: 'bg-yellow-500', width: 60  };
    if (score === 4) return { label: s('settings.security.strength.strong'),   color: 'bg-blue-500',   width: 80  };
    return                  { label: s('settings.security.strength.veryStrong'),color: 'bg-green-500', width: 100 };
  }

  changePassword(): void {
    this.pwError   = null;
    this.pwSuccess = false;
    if (!this.pwForm.currentPassword)        { this.pwError = this.tr('settings.security.currentPassword') + ' ' + this.tr('validation.required'); return; }
    if (this.pwForm.newPassword.length < 8)  { this.pwError = this.tr('validation.minLength').replace('{{length}}', '8'); return; }
    if (this.pwForm.newPassword !== this.pwForm.confirmPassword) { this.pwError = this.tr('settings.security.noMatch'); return; }

    this.pwLoading = true;
    const headers  = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.post(`${environment.apiUrl}/auth/change-password`, {
      currentPassword: this.pwForm.currentPassword,
      newPassword:     this.pwForm.newPassword
    }, { headers }).subscribe({
      next: () => {
        this.pwLoading = false;
        this.pwSuccess = true;
        this.pwForm    = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err: any) => {
        this.pwError   = err?.error?.message || this.tr('errors.generic');
        this.pwLoading = false;
      }
    });
  }

  // ── Preferences ──────────────────────────────────────────────
  loadPrefs(): void {
    const stored = localStorage.getItem('cmms_prefs');
    if (stored) { try { this.prefs = { ...this.prefs, ...JSON.parse(stored) }; } catch {} }
    // Sync with TranslationService
    this.prefs.language = this.t.getCurrentLanguage();
  }

  async savePrefs(): Promise<void> {
    // Apply language change immediately
    if (this.prefs.language !== this.t.getCurrentLanguage()) {
      await this.t.setLanguage(this.prefs.language);
    }
    localStorage.setItem('cmms_prefs', JSON.stringify(this.prefs));
    this.profileSuccess = true;
    setTimeout(() => { this.profileSuccess = false; }, 2500);
  }

  logout(): void { this.auth.logout(); }
}
