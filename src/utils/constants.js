// Application Constants for PARKit

export const APP_NAME = 'PARKit';
export const APP_TAGLINE = 'Find it. Park it. Move on.';
export const APP_IDENTIFIER = 'com.parkit.smartparking';
export const LOGO_PATH = '/images/parkit-logo.png';

// User Role (Driver-only application)
export const ROLES = {
  DRIVER: 'driver',
};

// Parking Slot Statuses - Strictly 3 states
export const SLOT_STATUS = {
  EMPTY: 'EMPTY',
  OCCUPIED: 'OCCUPIED',
  UNCERTAIN: 'UNCERTAIN',
};

// Visual colors matching brand system (Green ONLY for available parking status)
export const STATUS_COLORS = {
  EMPTY: {
    badge: 'badge-empty',
    hex: '#16A34A',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'Empty / Available',
    description: 'Confirmed empty space ready for parking.',
  },
  OCCUPIED: {
    badge: 'badge-occupied',
    hex: '#DC2626',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    label: 'Occupied',
    description: 'Space currently occupied by another vehicle.',
  },
  UNCERTAIN: {
    badge: 'badge-uncertain',
    hex: '#D97706',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Uncertain',
    description: 'Occluded or pending vision verification. NOT counted as available.',
  },
};

// Camera Connection Status
export const CAMERA_STATUS = {
  CONNECTED: 'CONNECTED',
  OFFLINE: 'OFFLINE',
  CALIBRATING: 'CALIBRATING',
  ERROR: 'ERROR',
};

// Session & Payment Statuses
export const SESSION_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

// Stale Detection Threshold (seconds)
export const STALE_DATA_THRESHOLD_SECONDS = 90;

// Polling interval in ms (5 - 10 seconds)
export const POLLING_INTERVAL_MS = 6000;
