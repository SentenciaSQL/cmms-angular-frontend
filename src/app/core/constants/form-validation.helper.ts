import { AbstractControl, FormGroup } from '@angular/forms';

export class FormValidationHelper {
  /**
   * Verifica si un control es inválido y debe mostrar error
   */
  static isInvalid(
    form: FormGroup,
    controlName: string,
    submitted: boolean = false
  ): boolean {
    const control = form.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || submitted)
    );
  }

  /**
   * Obtiene el mensaje de error para un control según sus validaciones
   */
  static getErrorMessage(
    form: FormGroup,
    controlName: string,
    errorMessages: { [key: string]: string | ((params?: any) => string) },
    submitted: boolean = false
  ): string | undefined {
    const control = form.get(controlName);

    if (!control || !(control.dirty || control.touched || submitted)) {
      return undefined;
    }

    // Itera sobre los errores del control
    for (const errorKey in control.errors) {
      if (control.hasError(errorKey)) {
        const errorMessage = errorMessages[errorKey];

        // Si es una función, la ejecuta con los parámetros del error
        if (typeof errorMessage === 'function') {
          return errorMessage(control.errors[errorKey]);
        }

        return errorMessage;
      }
    }

    return undefined;
  }
}
