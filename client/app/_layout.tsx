import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {useFonts} from 'expo-font'
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Fredoka-Regular":require('../assets/fonts/Fredoka-Regular.ttf'),
    "Fredoka-Light":require('../assets/fonts/Fredoka-Light.ttf'),
    "Fredoka-Medium":require('../assets/fonts/Fredoka-Medium.ttf'),
    "Fredoka-Semibold":require('../assets/fonts/Fredoka-SemiBold.ttf'),
    "Fredoka-Bold":require('../assets/fonts/Fredoka-Bold.ttf')
  })

  useEffect(()=>{
    if(fontsLoaded){
      SplashScreen.preventAutoHideAsync()
    }
  },[fontsLoaded])

  if(!fontsLoaded){
    return null 
  }

  return ( 
  <SafeAreaProvider>
    <SafeAreaView style={{flex:1}} edges={['top','left','right']}>
  <Stack>
    <Stack.Screen name="(tabs)" options={{headerShown:false}} />
    <Stack.Screen name="authPages/Login" options={{headerShown:false}} />
    <Stack.Screen name="authPages/CreateAccount" options={{headerShown:false}} />
    </Stack>
    </SafeAreaView>
    </SafeAreaProvider>
  )
}
