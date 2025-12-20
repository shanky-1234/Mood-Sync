import { StyleSheet, Text, View } from 'react-native'
import { LineChart } from "react-native-gifted-charts";
import React from 'react'

const Home = () => {
  const data = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];
  return (
    <View>
     <LineChart data={data}/>
     <LineChart data={data}/>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})