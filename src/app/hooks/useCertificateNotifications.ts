import { useEffect, useRef } from 'react';
import { useAlerts } from '../api/alerts';
import { useNotificationPermission } from './useNotificationPermission';
import { showCertificateExpiryNotification } from '../utils/pushNotifications';

const NOTIFIED_ALERTS_KEY = 'clearpass_notified_alerts';

function getNotifiedAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_ALERTS_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set<string>();
  }
}

function markNotified(id: string) {
  try {
    const set = getNotifiedAlerts();
    set.add(id);
    localStorage.setItem(NOTIFIED_ALERTS_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function useCertificateNotifications() {
  const { permission } = useNotificationPermission();
  const { data: alerts } = useAlerts();
  const notifiedRef = useRef<Set<string>>(getNotifiedAlerts());

  useEffect(() => {
    if (permission !== 'granted' || !alerts) return;

    const criticalAlerts = alerts.filter(
      (a) =>
        a.type === 'critical' &&
        a.certificateName &&
        a.daysToExpiry !== undefined &&
        a.daysToExpiry <= 14 &&
        !notifiedRef.current.has(a.id)
    );

    for (const alert of criticalAlerts) {
      showCertificateExpiryNotification(alert.certificateName!, alert.daysToExpiry!);
      notifiedRef.current.add(alert.id);
      markNotified(alert.id);
    }
  }, [permission, alerts]);
}
