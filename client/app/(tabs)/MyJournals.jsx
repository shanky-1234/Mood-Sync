import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const MyJournals = () => {
  return (
    <View>
      <Text>MyJournals</Text>
       <Link href={'../authPages/Login'}>Login</Link>
       <Link href={'../authPages/OnboardingAuth'}>Onboarding</Link>
    </View>
  )
}

export default MyJournals

const styles = StyleSheet.create({})