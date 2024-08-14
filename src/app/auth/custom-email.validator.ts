import { AbstractControl, ValidatorFn } from '@angular/forms';

export function CustomValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value !== '') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { invalidEmail: true };
    }
    return null;
  };
}
