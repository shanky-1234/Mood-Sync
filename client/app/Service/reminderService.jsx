import {
  cancelAllScheduledNotifications,
  scheduleDailyReminder,
} from "../utils/notificationScheduler";
import * as Notifications from "expo-notifications";

export const setupUserLocalReminders = async () => {
  try {
    await cancelAllScheduledNotifications();

    const now = new Date();
    let hour = now.getHours();
    let firstMinute = now.getMinutes() + 1;
    let secondMinute = now.getMinutes() + 2;

    if (firstMinute >= 60) {
      firstMinute = 0;
      hour = (hour + 1) % 24;
    }

    if (secondMinute >= 60) {
      secondMinute = secondMinute - 60;
    }

    const checkInId = await scheduleDailyReminder({
      hour,
      minute: firstMinute,
      title: "Check-In Reminder",
      body: "Take a moment to complete your daily check-in.",
      data: { type: "checkin_local" },
    });

    const journalId = await scheduleDailyReminder({
      hour,
      minute: secondMinute,
      title: "Journal Reminder",
      body: "Write a short journal entry for today.",
      data: { type: "journal_local" },
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
        seconds: 30,
      },
    });

    console.log("Scheduled notification ID:", id);

    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log("All scheduled notifications:", allScheduled);
  } catch (error) {
    console.log("Schedule test error:", error);
  }
};