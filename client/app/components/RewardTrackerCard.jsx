import { Image, StyleSheet, Text, View,  } from 'react-native'
import { Card, ProgressBar } from 'react-native-paper'
import React from 'react'


const RewardTrackerCard = () => {
  const progress = 0.5
  return (
    <Card style={styles.card} mode="contained" elevation={0} contentStyle={{padding:12}}>
      <View style={{flexDirection:"row", alignItems:'center',width:'100%', gap:12}}>
         <Image source={require('../../assets/icons/rewards.png')} style={{width:60,height:60}} resizeMode='contain'/>
         <View style={{flex:1}}>
     <Text style={styles.cardText}>Reward Title</Text>
    <ProgressBar progress={progress} theme={{ colors: { primary: '#00E038' } }} style={{marginTop:8}}  />
    <Text style={{fontSize:14, fontFamily:'JosefinSlab-SemiBold', marginTop:4}}>{progress * 100}% Completed</Text>
    </View>
      </View>
     
    </Card>
  )
}

export default RewardTrackerCard

const styles = StyleSheet.create({
  card:{
    backgroundColor:'#fff',
    borderRadius:16,
    borderWidth:1,
    borderColor:'#E1E1E1',
  },
  cardText:{
    fontFamily:'Fredoka-Regular',
    fontSize:16
  }
})