import {ChangeDetectorRef, effect, inject, Injector, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {TranslationService} from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private lastKey: string = '';
  private lastValue: string = '';

  constructor() {
    // Usar effect para reaccionar a cambios en el idioma
    effect(() => {
      // Acceder al signal para registrar la dependencia
      this.translationService.language();
      // Marcar para verificación de cambios cuando el idioma cambie
      this.cdr.markForCheck();
    }, { injector: this.injector });
  }

  transform(key: string, params?: Record<string, any>): string {
    if (!key) {
      return '';
    }

    return this.translationService.translate(key, params);
  }

  ngOnDestroy(): void {
  }

}
