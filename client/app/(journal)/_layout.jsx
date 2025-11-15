import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../Constants/styleVariable'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name='addJournal' options={{title:'Add Journal',headerStyle:{backgroundColor:'#FBE7E5'},headerShadowVisible:false,headerTitleStyle:{fontFamily:'Fredoka-Medium',fontSize:28,color:Colors.primary}}}/>
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})