import {Component, inject, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {TranslationService, Language} from '../../../services/translation.service';
import "flag-icons/css/flag-icons.min.css";

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
})
export class LanguageSelectorComponent {
  @Input() buttonStyleRounded?: boolean = false;

  private translationService = inject(TranslationService);

  currentLang = this.translationService.language;

  async changeLanguage(lang: Language): Promise<void> {
    console.log('Changing language to:', lang);
    await this.translationService.setLanguage(lang);
  }
}
