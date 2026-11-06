import { useNotification } from '../context/NotificationContext';

export function useNotifications() {
  return useNotification();
}

