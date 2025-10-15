import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import { Colors } from '../Constants/styleVariable'

const MoodCoach = () => {
  return (
    <Card mode='contained' style={styles.card}>
        <View style={{flexDirection:'row',alignItems:'center', gap:12}}>
        <Image source={require('../../assets/icons/MoodCoach.png')} style={{width:70,height:70}} resizeMode='contain'/>
        <Text style={{fontSize:20, fontFamily:'Fredoka-Medium', color:Colors.primary}}>Mood Coach</Text>
        </View>
        <View style={{position:'relative', marginLeft:20}}>
        <View style={styles.triangle} />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            Your mood score today is <Text style={{fontFamily:'Fredoka-Bold'}}> 32/100 </Text>. Work stress and lack of sleep are the main triggers. So get some quick rest and sleep
          </Text>
        </View>
        </View>
    </Card>
  )
}

export default MoodCoach

const styles = StyleSheet.create({
     card:{
    backgroundColor:'#fff',
    borderRadius:16,
    borderWidth:1,
    borderColor:'#E1E1E1',
    padding:20
  },
  cardText:{
    fontFamily:'Fredoka-Regular',
    fontSize:16
  },
  triangle: {
    position: 'absolute',
    top: -6,
    left: 16,
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderRightWidth: 16,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E85D5D',
    transform: [{ rotate: '125deg' }],
  },
   speechBubble: {
    backgroundColor: '#E85D5D',
    borderRadius: 16,
    padding: 20,
    marginLeft: 8,
  },
  speechText: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  }
})