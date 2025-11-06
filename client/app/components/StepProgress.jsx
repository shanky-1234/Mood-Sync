import { StyleSheet, Text, Touchable, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Colors } from '../Constants/styleVariable'
import { useRouter } from 'expo-router'

const StepProgress = ({totalSteps = 5,currentStep,progressLink}) => {
  
  return (
    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
   {[...Array(totalSteps)].map((_,index)=>(
     <TouchableOpacity key={index} style={[styles.progressbarInactive,
      index<=currentStep ? styles.active : styles.inactive
     ]} disabled={index>=currentStep && true} onPress={()=>index < currentStep && progressLink && progressLink()}>
    </TouchableOpacity>
   ))}
   </View>
  )
}

export default StepProgress

const styles = StyleSheet.create({
  progressbarInactive:{
    width:60,
    height:16,
   
    borderRadius:40
  },
  active:{
     backgroundColor:Colors.primary,
  },
  inactive:{
     backgroundColor:'#FFBBB2',
  }
})