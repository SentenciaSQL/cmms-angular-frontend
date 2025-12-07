import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ThemeToggleTwoComponent} from '../../shared/components/common/theme-toggle-two/theme-toggle-two.component';
import {GridShapeComponent} from '../../shared/components/common/grid-shape/grid-shape.component';
import {LanguageSelectorComponent} from '../../shared/components/common/language-selector/language-selector.component';
import {NgOptimizedImage} from '@angular/common';
import {TranslatePipe} from '../../shared/pipes/translate-pipe';

@Component({
  selector: 'app-auth-layout',
  imports: [
    ThemeToggleTwoComponent,
    GridShapeComponent,
    RouterLink,
    RouterOutlet,
    LanguageSelectorComponent,
    NgOptimizedImage,
    TranslatePipe
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {

}
