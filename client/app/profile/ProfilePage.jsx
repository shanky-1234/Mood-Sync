import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import axios from 'axios'
import authService from '../Service/auth'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../redux/slices/authSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, useRouter } from 'expo-router'

const ProfilePage = () => {
const dispatch = useDispatch()
const router = useRouter()
const handleLogout = async()=>{
 try {
    const response = await authService.logout()
    if(response){
      dispatch(setUser(null))
      dispatch(setToken(''))
      AsyncStorage.removeItem('UserData')
      AsyncStorage.removeItem('UserToken')
      router.replace('/authPages/OnboardingAuth')
    }
 } catch (error) {
  console.error(error)
 }
}
  return (
    <View >
      <Link href={'../(tabs)/index'}>Go Back</Link>
      <Button mode='contained' onPress={()=>handleLogout()}>Log Out</Button>
    </View>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})