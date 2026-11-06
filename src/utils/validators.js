// Validation utilities

export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone) return false;
  const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
  return phoneRegex.test(phone.trim());
}

export function isValidLicensePlate(plate) {
  if (!plate) return false;
  // Alphanumeric with optional hyphens/spaces, length 2 to 12
  const plateRegex = /^[A-Z0-9\-\s]{2,12}$/i;
  return plateRegex.test(plate.trim());
}

export function validatePassword(password) {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  return { isValid: true, message: '' };
}

