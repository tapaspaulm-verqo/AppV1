import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Client-side GSTIN format check — mirrors Verqo.Application.Kyc.GstinValidator
 * on the .NET side exactly, for instant feedback. GSTIN is optional at Client
 * registration, so this validator (like the .NET one) only rejects a value
 * that's actually present but malformed; it never enforces `required`. The
 * API re-validates (never trust the client) and, same as the .NET side,
 * deliberately doesn't recompute the mod-36 check digit — see
 * GstinValidator's remarks for why.
 */
const GSTIN_FORMAT = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const VALID_PAN_HOLDER_TYPE_CODES = new Set(['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T']);

export function gstinValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '').toString().trim().toUpperCase();
    if (!raw) return null; // GSTIN is optional — nothing to validate

    if (!GSTIN_FORMAT.test(raw)) {
      return {
        gstinFormat:
          "GSTIN must be 15 characters: a 2-digit state code, the business's 10-character PAN, an entity number, 'Z', and a check digit.",
      };
    }
    const stateCode = Number(raw.slice(0, 2));
    if (stateCode < 1 || stateCode > 38) {
      return { gstinFormat: 'The first two digits of a GSTIN must be a valid state code (01–38).' };
    }
    if (!VALID_PAN_HOLDER_TYPE_CODES.has(raw[5])) {
      return { gstinFormat: 'The PAN embedded in the GSTIN (characters 3–12) is not validly formatted.' };
    }
    return null;
  };
}
