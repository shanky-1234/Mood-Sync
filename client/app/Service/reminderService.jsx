import {
  cancelAllScheduledNotifications,
  scheduleDailyReminder,
  getAllScheduledNotifications
} from "../utils/notificationScheduler";
import * as Notifications from "expo-notifications";

export const setupUserLocalReminders = async (setting,userId) => {
  try {
    await cancelAllScheduledNotifications();

    const checkInId = await scheduleDailyReminder({
      hour:setting.checkin.hour,
      minute: setting.checkin.minute,
      title: "Check-In Reminder",
      body: "Take a moment to complete your daily check-in.",
      data: { type: "checkin_local", userId },
    },);

    const journalId = await scheduleDailyReminder({
      hour: setting.journal.hour,
      minute: setting.journal.minute,
      title: "Journal Reminder",
      body: "Write a short journal entry for today.",
      data: { type: "journal_local", userId },
    });

    console.log("Check-in notification ID:", checkInId);
    console.log("Journal notification ID:", journalId);

    const scheduled = await getAllScheduledNotifications();
    console.log(
      "Scheduled notifications:",
      JSON.stringify(scheduled, null, 2)
    );
  } catch (error) {
    console.log("setupFixedLocalReminders error:", error);
  }
};

export const testScheduledNotification = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Scheduled Test",
        body: "This is a local scheduled notification after 30 seconds.",
        sound: true,
        data: { type: "scheduled_test" },
      },
      trigger: {
        seconds: 15,
      },
    });

    console.log("Scheduled notification ID:", id);

    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log("All scheduled notifications:", allScheduled);
  } catch (error) {
    console.log("Schedule test error:", error);
  }
};