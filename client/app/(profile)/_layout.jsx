import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Colors } from '../Constants/styleVariable'
import Ionicons from '@expo/vector-icons/Ionicons'


const Layout = () => {
  const router = useRouter()
  return (
    <Stack>
        <Stack.Screen name='ProfilePage' options={{title:'My Profile',headerStyle:{backgroundColor:'#FBE7E5'},headerLeft:()=>(
                <Ionicons name="arrow-back" size={32} color={Colors.primary} onPress={()=>router.replace('/(tabs)')}/>
        ),headerShadowVisible:false,headerTitleStyle:{fontFamily:'Fredoka-Bold',fontSize:28,color:Colors.primary}}}/>
       
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})