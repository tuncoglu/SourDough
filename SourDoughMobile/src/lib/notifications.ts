import * as Notifications from 'expo-notifications';

/**
 * Notification scheduling for fold reminders and starter feeding.
 */

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Request notification permissions */
export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** Check existing notification permissions */
export async function checkPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/** Schedule fold reminders starting after bulk fermentation begins */
export async function scheduleFoldReminders(
  startTime: Date,
  intervalMinutes: number,
  count: number,
  label: string = 'Fold the dough',
): Promise<string[]> {
  const ids: string[] = [];

  for (let i = 0; i < count; i++) {
    const trigger = new Date(startTime.getTime() + (i + 1) * intervalMinutes * 60000);
    // Don't schedule past reminders
    if (trigger.getTime() <= Date.now()) continue;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🍞 ${label}`,
        body: `Fold #${i + 1} of ${count} — time to stretch and fold!`,
        sound: 'default',
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
    });
    ids.push(id);
  }

  return ids;
}

/** Schedule a one-shot reminder (e.g., shape, bake) */
export async function scheduleReminder(
  title: string,
  body: string,
  triggerDate: Date,
): Promise<string | null> {
  if (triggerDate.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });
}

/** Schedule recurring starter feeding reminder */
export async function scheduleFeedingReminder(
  intervalHours: number,
): Promise<string | null> {
  // Cancel existing feeding reminders first
  await cancelFeedingReminders();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: '🕰️ Feed Your Starter',
      body: `Time to feed your starter — it's been ${intervalHours} hours.`,
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: intervalHours * 3600,
      repeats: true,
    },
  });
}

/** Cancel all fold/shape reminders */
export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Cancel only feeding reminders (by re-scheduling everything else is tricky;
 *  simpler: this cancels specifically tracked feeding ID) */
export async function cancelFeedingReminders(): Promise<void> {
  // We track the feeding reminder ID and cancel it
  const all = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of all) {
    if (n.content.title?.includes('Feed Your Starter')) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}
