import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

Notifications.setNotificationHandler({
    handleNotification:async() =>({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert:true,
    })
})

const PushnotificationManager = ({children}) => {
    const registerForNotification = async() =>{
        let token
        
        if(Platform.OS === 'android'){
            await Notifications.setNotificationChannelAsync('default',{
                name:'default',
                importance:Notifications.AndroidImportance.MAX,
                vibrationPattern:[0,250,250,250],
                lightColor:'#ff231f7c'
            })
        }

        if(Device.isDevice){
            const {status:existingStatus} = await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus

            if(existingStatus !== 'granted'){ // request if not granted
                const {status} = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }

            if(finalStatus !== 'granted'){ // checks if permissions are granted
                console.warn('Failed to get Notifications')
                return
            }

            try{
                const projectId = Constants?.expoConfig?.extra?.eas?.projectId

                if(!projectId) {
                    console.error('No project ID found. Please configure in app.json')
                    return
                }

                token = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId:projectId,
                    })
                ).data

                console.log('Token',token) // Get The Token 
                return token
            }
            catch(error){
                console.error('error pushing notification')
                 if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        else{
             console.warn('Must use physical device for Push Notifications');
        }
        return token       
            }

        }

        useEffect(()=>{
            registerForNotification().then((token)=>{
                if(token){}
            })
                const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(
          'Notification Received:',
          notification.request.content.data,
        );
      },
    );


        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response)=>{
            const data = response.notification.request.content.data
            console.log('Notification Data: ',data)
        })

        return () =>{
            receivedSubscription.remove()
            responseSubscription.remove()
        }
        },[])
    }
  return (
   {children}
  )


}

export default PushnotificationManager

