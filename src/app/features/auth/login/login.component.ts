import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LabelComponent} from '../../../shared/components/forms/label/label.component';
import {InputFieldComponent} from '../../../shared/components/forms/input/input-field.component';
import {CheckboxComponent} from '../../../shared/components/forms/input/checkbox.component';
import {ButtonComponent} from '../../../shared/components/ui/button/button.component';
import {TranslatePipe} from '../../../shared/pipes/translate-pipe';
import {TranslationService} from '../../../shared/services/translation.service';
import {AlertComponent} from '../../../shared/components/ui/alert/alert.component';
import {FormValidationHelper} from '../../../core/constants/form-validation.helper';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, LabelComponent, InputFieldComponent, CheckboxComponent, RouterLink, ButtonComponent, FormsModule, TranslatePipe, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private translation = inject(TranslationService);

  loginForm!: FormGroup;
  passwordVisible = false;

  submitted = false;
  loading = false;

  returnUrl = '';
  loginError : string | null = null;

  ngOnInit(): void {
    console.log('LoginComponent initialized');
    // Crear formulario
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    // Obtener URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }

    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginError) {
        this.loginError = null;
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // ¿El control es inválido y ya se debería mostrar el error?
  isInvalid(controlName: string): boolean {
    // const control = this.loginForm.get(controlName);
    // return !!(
    //   control &&
    //   control.invalid &&
    //   (control.dirty || control.touched || this.submitted)
    // );
    return FormValidationHelper.isInvalid(
      this.loginForm,
      controlName,
      this.submitted
    );
  }

  // Mensaje para usernameOrEmail
  get usernameOrEmailHint(): string | undefined {
    // const control = this.loginForm.get('usernameOrEmail');
    // if (!control || !(control.dirty || control.touched || this.submitted)) return;
    //
    // if (control.hasError('required')) {
    //   return this.translation.translate('auth.errors.usernameRequired');
    // }
    //
    // if (control.hasError('minlength')) {
    //   return  this.translation.translate('auth.errors.usernameMinLength', { length: 3 });
    // }
    //
    // return;
    return FormValidationHelper.getErrorMessage(
      this.loginForm,
      'usernameOrEmail',
      {
        required: this.translation.translate('auth.errors.usernameRequired'),
        minlength: (error) => this.translation.translate(
          'auth.errors.usernameMinLength',
          { length: error.requiredLength }
        )
      },
      this.submitted
    );
  }

  // Mensaje para password
  get passwordHint(): string | undefined {
    // const control = this.loginForm.get('password');
    // if (!control || !(control.dirty || control.touched || this.submitted)) return;
    //
    // if (control.hasError('required')) {
    //   return this.translation.translate('auth.errors.passwordRequired');
    // }
    //
    // if (control.hasError('minlength')) {
    //   return this.translation.translate('auth.errors.passwordMinLength', { length: 6 });
    // }
    //
    // return;

    return FormValidationHelper.getErrorMessage(
      this.loginForm,
      'password',
      {
        required: this.translation.translate('auth.errors.passwordRequired'),
        minlength: (error) => this.translation.translate(
          'auth.errors.passwordMinLength',
          { length: error.requiredLength }
        )
      },
      this.submitted
    );
  }

  onSignIn() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const  { usernameOrEmail, password, rememberMe } = this.loginForm.value;

    this.loading = true;
    this.loginError = null

    const credentials = {
      usernameOrEmail,
      password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loginError  = null;
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        if (error.status === 401) {
          this.loginError = this.translation.translate('auth.errors.invalidCredentials');
        } else if (error.status === 0) {
          this.loginError = this.translation.translate('errors.networkError');
        } else {
          this.loginError = this.translation.translate('auth.errors.loginFailed');
        }

        this.loading = false;

        this.cdr.detectChanges();
      },
      complete: () => {

      }
    });
  }

  dismissError(): void {
    this.loginError = null;
  }

}
