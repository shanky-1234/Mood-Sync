import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const addJournal = () => {
  return (
    <View>
      <Text>addJournal</Text>
      <Link href={'index'}>Go Back</Link>
    </View>
  )
}

export default addJournal

const styles = StyleSheet.create({})