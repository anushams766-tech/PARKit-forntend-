// Date and Freshness utilities
import { STALE_DATA_THRESHOLD_SECONDS } from './constants'

export function formatDateTime(isoString) {
  if (!isoString) return '--';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '--';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTimeOnly(isoString) {
  if (!isoString) return '--';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatRelativeTime(isoString) {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Unknown';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function isDataStale(isoString, thresholdSeconds = STALE_DATA_THRESHOLD_SECONDS) {
  if (!isoString) return true;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return true;
  const diffInSeconds = (Date.now() - date.getTime()) / 1000;
  return diffInSeconds > thresholdSeconds;
}

