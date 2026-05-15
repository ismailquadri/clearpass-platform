export function showCertificateExpiryNotification(
  certificateName: string,
  daysRemaining: number,
) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  const title = daysRemaining <= 0
    ? `Certificate Expired: ${certificateName}`
    : `Certificate Expiring Soon: ${certificateName}`;

  const body = daysRemaining <= 0
    ? `Your ${certificateName} certificate has expired. Renew immediately to maintain compliance.`
    : daysRemaining <= 7
      ? `URGENT: Your ${certificateName} certificate expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}. Renew now.`
      : `Your ${certificateName} certificate will expire in ${daysRemaining} days. Please renew soon.`;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/clearpass-logo.svg',
      tag: `cert-expiry-${certificateName}`,
      requireInteraction: daysRemaining <= 7,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    // Notification may fail silently in some browsers
  }
}

export function showComplianceAlertNotification(score: number, previousScore: number) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  const dropped = previousScore - score;
  const title = dropped > 0 ? 'Compliance Score Dropped' : 'Compliance Score Updated';
  const body = dropped > 0
    ? `Your compliance score dropped by ${dropped} point${dropped === 1 ? '' : 's'} to ${score}%.`
    : `Your compliance score is now ${score}%.`;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/clearpass-logo.svg',
      tag: 'compliance-score',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    // Notification may fail silently
  }
}
