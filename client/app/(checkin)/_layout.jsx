import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Colors } from '../Constants/styleVariable'
import { Button } from 'react-native-paper'
import AntDesign from '@expo/vector-icons/AntDesign';
import getCurrentDate from '../utils/getCurrentDate'

const Layout = () => {
    const date = getCurrentDate()
    const router = useRouter()
  return (
    <Stack screenOptions={{headerStyle:{
        backgroundColor:'#FCE9E7',
    },headerTitle:()=>(

        <View style={{alignItems:'center',justifyContent:'center'}}>
            <Text style={{
                color: 'black',
                fontFamily: "JosefinSlab-Bold",
                fontSize: 16,
              }}>{date}</Text>
            <Text style={{
                color: Colors.primary,
                fontFamily: "Fredoka-Bold",
                fontSize: 28,
                marginTop:18
              }}>Check-In</Text>
        </View>
    ),headerRight:()=>(
        <Button style={{marginTop:28}}><AntDesign name="close" size={24} color={Colors.primary} onPress={()=>router.replace('/(tabs)')}/></Button>
    ),headerTitleStyle:{color:Colors.primary,fontFamily:'Fredoka-Bold',fontSize:28},headerTitleAlign:'center',headerShadowVisible:false}}>
        <Stack.Screen name='firstStep' options={{ headerShown:true}}/>
          <Stack.Screen name='secondStep' options={{headerShown:true}}/>
            <Stack.Screen name='thirdStep' options={{headerShown:true}}/>
              <Stack.Screen name='fourthStep' options={{headerShown:true}}/>
                <Stack.Screen name='fifthStep' options={{headerShown:true}}/>

        
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})