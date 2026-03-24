import { Platform } from "react-native";
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

export const setupNotification=async()=> {
    if(Platform.OS === 'android'){
        await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

export const registerForPushNotificationsAsync =async ()=>{
    if(!Device.isDevice){
        console.warn('Must Use Physical Device')
        return null
    }

    const {status:existingStatus} = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if(existingStatus !== "granted"){
        const {status} = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    if(finalStatus!="granted"){
        console.warn('Permission Not Granted')
        return null
    }

    try{
        const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.error("No EAS projectId found");
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return token;
  } catch (error) {
    console.error("Error getting Expo push token:", error);
    return null;
  }
}
