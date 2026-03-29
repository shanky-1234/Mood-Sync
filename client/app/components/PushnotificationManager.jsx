import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { setupNotification, registerForPushNotificationsAsync } from "../Service/notificationService";
import { setupUserLocalReminders } from "../Service/reminderService";
import api from "../Service/api";
import { useSelector } from "react-redux";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldShowBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldShowBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const PushnotificationManager = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const isLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    const initNotifications = async () => {

      await setupNotification();

      const expoPushToken = await registerForPushNotificationsAsync();
      console.log(expoPushToken)
      if (expoPushToken) {
        try {
          await api.post("/noti/register-token", { token: expoPushToken });
          console.log("Expo push token saved");
        } catch (error) {
          console.error("Token save error:", error?.response?.data || error.message);
        }
      }

      await setupUserLocalReminders();
    };

    initNotifications();

    const receivedSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Notification clicked:",
          response.notification.request.content.data
        );
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [token, isLoading]);

  return <>{children}</>;
};

export default PushnotificationManager;