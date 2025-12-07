import {Directive, effect, ElementRef, inject, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {TranslationService} from '../services/translation.service';

@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit, OnDestroy{
  private el = inject(ElementRef);
  private translationService = inject(TranslationService);
  private injector = inject(Injector);

  @Input('appTranslate') translationKey: string = '';
  @Input() translateParams?: Record<string, any>;

  constructor() {
    effect(() => {
      this.translationService.language();
      this.updateTranslation();
    }, { injector: this.injector });
  }

  ngOnInit(): void {
    this.updateTranslation();
  }

  private updateTranslation(): void {
    if (this.translationKey) {
      const translation = this.translationService.translate(
        this.translationKey,
        this.translateParams
      );
      this.el.nativeElement.textContent = translation;
    }
  }

  ngOnDestroy(): void {
    // Limpieza si es necesario
  }

}
