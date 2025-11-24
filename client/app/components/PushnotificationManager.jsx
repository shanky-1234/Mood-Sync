import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

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

  useEffect(() => {
    const registerForNotifications = async () => {
      let token;

      // Android channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#ff231f7c",
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Failed to get push token permissions");
          return;
        }

        try {
          const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
          if (!projectId) {
            console.error("No project ID found. Configure in app.json");
            return;
          }

          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
          console.log("Push Token:", token);

          // TODO: send this token to your backend
          // await api.post("/notifications/register", { token });
        } catch (error) {
          console.error("Error getting push token:", error);
        }
      } else {
        console.warn("Must use physical device for push notifications");
      }
    };

    registerForNotifications();

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Received:", notification.request.content.data);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification Response:", response.notification.request.content.data);
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return <>{children}</>;
};

export default PushnotificationManager;
