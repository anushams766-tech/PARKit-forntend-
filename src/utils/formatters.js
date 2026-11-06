// Formatting helpers for PARKit
export { formatDateTime, formatTimeOnly, formatRelativeTime, isDataStale } from './dateHelpers';

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDistance(distanceMeters) {
  if (!distanceMeters && distanceMeters !== 0) return 'Distance unavailable';
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '--';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export function formatPlateNumber(plate) {
  if (!plate) return '';
  return plate.toUpperCase().trim();
}
