import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [ReactiveFormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  private readonly fb = inject(FormBuilder);

  public readonly orderForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],

    age: ['', ageValidator()],
    agreeToTerms: [true, Validators.requiredTrue],
  });

  public onSumbit() {
    if (this.orderForm.invalid) return;
    console.log('Форма отправлена:', this.orderForm.getRawValue());
    this.orderForm.reset();
  }
}

function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    if (isNaN(num) || num < 18 || num > 65) {
      return { age: { message: 'Возраст должен быть от 18 до 65 лет' } };
    }
    return null;
  };
}
