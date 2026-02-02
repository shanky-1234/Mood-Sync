import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors } from '../Constants/styleVariable'
import React from 'react'

const CheckInCard = ({moodScore,time,handlePress}) => {

  return (
    <TouchableOpacity style={{padding:12,backgroundColor:'#fff', borderRadius:12}} onPress={handlePress}>
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View>
            <AnimatedCircularProgress
        size={70}
        width={8}
        fill={moodScore}
        tintColor='#fff'
        onAnimationComplete={() => console.log('onAnimationComplete')}
        padding={0}
        rotation={0}
        backgroundWidth={12}
        backgroundColor={Colors.primary} >
          {
            (fill)=>(
              <Text style={{fontFamily:'Fredoka-Medium',fontSize:16, color:Colors.primary}}>{fill}</Text>
            )
          }
          </AnimatedCircularProgress>
          </View>
          <View>
            <Text style={{fontFamily:'Fredoka-Semibold',fontSize:20}}>Check-In</Text>
            <Text style={{fontFamily:'Fredoka-Medium',fontSize:16,color:Colors.primary}}>Overall Mood Score</Text>
            <Text style={{fontFamily:'JosefinSlab-SemiBold',fontSize:16,color:Colors.primary}}>View More</Text>
          </View>
          <View style={{padding:8,backgroundColor:'#FFE1DD',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                <FontAwesome5 name="clock" size={20} color={Colors.primary} />
                <Text style={{fontFamily:'Fredoka-Medium',fontSize:14,color:Colors.primary}}>{time}</Text>
          </View>
          </View>
    </TouchableOpacity>
  )
}

export default CheckInCard

const styles = StyleSheet.create({})