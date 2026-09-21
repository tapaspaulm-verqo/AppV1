import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Client-side PAN format check — mirrors Verqo.Application.Kyc.PanValidator
 * on the .NET side exactly, for instant feedback. The API re-validates
 * (never trust the client), and is the only place that can eventually call
 * a real PAN-verification vendor.
 */
const PAN_FORMAT = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const VALID_HOLDER_TYPE_CODES = new Set(['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T']);

export function panValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '').toString().trim().toUpperCase();
    if (!raw) return null; // let `required` handle emptiness

    if (!PAN_FORMAT.test(raw)) {
      return { panFormat: 'PAN must be in the format AAAAA9999A (5 letters, 4 digits, 1 letter).' };
    }
    if (!VALID_HOLDER_TYPE_CODES.has(raw[3])) {
      return { panFormat: `'${raw[3]}' in position 4 is not a recognised PAN holder-type code.` };
    }
    return null;
  };
}
