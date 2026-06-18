import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { requestPermissions, checkPermissions } from '../lib/notifications';

export function useNotifications() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissions().then(setHasPermission);
  }, []);

  const request = async (): Promise<boolean> => {
    const granted = await requestPermissions();
    setHasPermission(granted);
    return granted;
  };

  return { hasPermission, request };
}
