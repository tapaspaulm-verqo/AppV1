import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Client-side Aadhaar format + Verhoeff checksum check — mirrors
 * Verqo.Application.Kyc.AadhaarValidator on the .NET side exactly (same
 * public-domain Verhoeff tables), for instant feedback before the number
 * ever leaves the browser. The API re-validates and is the only place a
 * real UIDAI e-KYC call could eventually be made — see
 * IKycVerificationService for why that isn't wired up yet.
 */
const AADHAAR_FORMAT = /^[2-9][0-9]{11}$/;

const D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

function verhoeffIsValid(digits: string): boolean {
  let c = 0;
  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[digits.length - 1 - i]);
    c = D[c][P[i % 8][digit]];
  }
  return c === 0;
}

export function aadhaarValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '').toString().replace(/\s+/g, '').trim();
    if (!raw) return null;

    if (!AADHAAR_FORMAT.test(raw)) {
      return { aadhaarFormat: 'Aadhaar must be exactly 12 digits and cannot start with 0 or 1.' };
    }
    if (!verhoeffIsValid(raw)) {
      return { aadhaarChecksum: 'Aadhaar number failed checksum validation — check for a typo.' };
    }
    return null;
  };
}
