import { CommonModule } from '@angular/common';
import {Component, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule],
  template: `
  <label
  class="flex items-center space-x-3 group cursor-pointer"
  [ngClass]="{ 'cursor-not-allowed opacity-60': disabled }"
>
  <div class="relative w-5 h-5">
    <input
      [id]="id"
      type="checkbox"
      class="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"
      [ngClass]="className"
      [checked]="checked"
      (change)="onChangeInput($event)"
      [disabled]="disabled"
    />
    @if (checked) {
    <ng-container>
      <svg
        class="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
          stroke="white"
          stroke-width="1.94437"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </ng-container>
    }
    @if (disabled) {
    <ng-container>
      <svg
        class="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
          stroke="#E4E7EC"
          stroke-width="2.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </ng-container>
    }
  </div>
  @if (label) {
  <span
    class="text-sm font-medium text-gray-800 dark:text-gray-200"
    >
      {{ label }}
  </span>
  }
</label>
  `,
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ]
})
export class CheckboxComponent {

  @Input() label?: string;
  @Input() checked = false;
  @Input() className = '';
  @Input() id?: string;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.checked = !!obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChangeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;

    // Avisamos al FormControl
    this.onChange(this.checked);

    // Y al padre si usa (checkedChange)
    this.checkedChange.emit(this.checked);
  }

  onBlur() {
    this.onTouched();
  }

  // onChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   this.checkedChange.emit(input.checked);
  // }
}
