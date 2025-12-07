import {computed, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

export type Language = 'es' | 'en'

interface TranslationData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLang = signal<Language>('es');
  private translations = signal<TranslationData>({});

  // Computed signal para exponer el idioma actual como readonly
  public language = computed(() => this.currentLang());
  public loaded = computed(() => this.isLoaded());
  private isLoaded = signal<boolean>(false);

  constructor(private http: HttpClient) {

  }

  /**
   * Inicialización que debe ser llamada por APP_INITIALIZER
   * Esto asegura que las traducciones estén cargadas antes de renderizar
   */
  async initialize(): Promise<void> {
    const savedLang = localStorage.getItem('language') as Language;
    const browserLang = navigator.language.split('-')[0] as Language;
    const initialLang = savedLang || (browserLang === 'es' || browserLang === 'en' ? browserLang : 'es');

    await this.loadTranslations(initialLang);
  }

  /**
   * Carga las traducciones para el idioma especificado
   */
  async loadTranslations(lang: Language): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<TranslationData>(`/assets/i18n/${lang}.json`)
      );

      this.translations.set(data);
      this.currentLang.set(lang);
      this.isLoaded.set(true);
      localStorage.setItem('language', lang);

      // Actualizar el atributo lang del documento
      document.documentElement.lang = lang;
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);

      // Si falla, intentar cargar español como fallback
      if (lang !== 'es') {
        await this.loadTranslations('es');
      } else {
        // Si incluso español falla, usar traducciones vacías
        this.translations.set({});
        this.isLoaded.set(true);
      }
    }
  }

  /**
   * Cambia el idioma actual
   */
  async setLanguage(lang: Language): Promise<void> {
    if (lang !== this.currentLang()) {


      await this.loadTranslations(lang);
    }
  }

  /**
   * Obtiene una traducción usando notación de punto
   * Ejemplo: translate('common.save') o translate('workOrders.status.pending')
   */
  translate(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value: any = this.translations();

    // Navegar por el objeto de traducciones
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Durante la carga inicial, mostrar un placeholder en lugar de la clave
        if (!this.isLoaded()) {
          return '...';
        }
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // Si el valor final no es un string, retornar la clave
    if (typeof value !== 'string') {
      return key;
    }

    // Reemplazar parámetros si existen
    if (params) {
      return this.interpolate(value, params);
    }

    return value;
  }

  /**
   * Interpolación de parámetros en la traducción
   * Ejemplo: "Debe tener al menos {{length}} caracteres"
   */
  private interpolate(text: string, params: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  /**
   * Obtiene el idioma actual
   */
  getCurrentLanguage(): Language {
    return this.currentLang();
  }

  /**
   * Obtiene todas las traducciones actuales
   */
  getTranslations(): TranslationData {
    return this.translations();
  }

  /**
   * Verifica si existe una traducción para una clave
   */
  hasTranslation(key: string): boolean {
    const keys = key.split('.');
    let value: any = this.translations();

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return false;
      }
    }

    return typeof value === 'string';
  }

}
