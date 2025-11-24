import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Colors } from '../Constants/styleVariable'
import AntDesign from '@expo/vector-icons/AntDesign'

const Layout = () => {
  const router = useRouter()
  return (
    <Stack>
        <Stack.Screen name='addJournal' options={{title:'Add Journal',headerStyle:{backgroundColor:'#FBE7E5'},headerRight:()=>(
           <AntDesign name="close" size={24} color={Colors.primary} onPress={()=>router.replace('/(tabs)/MyJournals')}/>
        ),headerShadowVisible:false,headerTitleStyle:{fontFamily:'Fredoka-Medium',fontSize:28,color:Colors.primary}}}/>
        <Stack.Screen name="journalPage" options={{headerShown:false}}/>
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})