import { useState, useEffect, useCallback } from 'react';

export type NotificationPermissionState = NotificationPermission | 'unsupported';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermissionState>(() => {
    if (typeof Notification === 'undefined') return 'unsupported';
    return Notification.permission;
  });

  useEffect(() => {
    if (typeof Notification === 'undefined') return;

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'unsupported' as const;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  return { permission, requestPermission };
}
