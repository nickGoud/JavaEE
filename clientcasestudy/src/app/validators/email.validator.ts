import { AbstractControl } from '@angular/forms';
export function ValidateEmail(
  control: AbstractControl
): { invalidEmail: boolean } | null {
  //https://www.w3resource.com/javascript/form/email-validation.php#:~:text=To%20get%20a%20valid%20email,%5D%2B)*%24%2F.
  const EMAIL_REGEXP =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return !EMAIL_REGEXP.test(control.value) ? { invalidEmail: true } : null;
} // ValidateEmail
