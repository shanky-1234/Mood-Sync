import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import StepProgress from '../components/StepProgress'
import { globalStyle } from '../Constants/globalStyles'
import { Button } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'
import { Slider } from '@miblanchard/react-native-slider'
import { Colors } from '../Constants/styleVariable'
import { useCheckIn } from '../Context/CheckinContext'

const secondStep = () => {
  const currentStep=1
  const router = useRouter()
  const handleLinking = () =>{
    router.back()
  }
  const [sliderValue,setSliderValue] = useState(Number(0))
  const [energyValue,setEnergyValue] = useState('Low')
 const {state,dispatch} = useCheckIn()

  const handleSliderValue = (value) =>{
    setSliderValue(value[0])
    dispatch({type:'UPDATE_STEP2_ENERGY',payload:value[0]})
    value >= 0.1 && value < 0.3
                  ? setEnergyValue('Low Energy')
                  : value >= 0.3 && value < 0.5
                  ? setEnergyValue('Moderate Energy')
                  : value >= 0.5 && value < 0.8
                  ? setEnergyValue('Good Energy')
                  : value >= 0.8
                  ? setEnergyValue('Fully Energized')
                  : setEnergyValue('No Energy')

  }
  return (
<View style={[{backgroundColor:'#FCE9E7',flex:1,}]}>
    <View style={globalStyle.container}>
      <StepProgress currentStep={currentStep} progressLink={handleLinking}/>
      </View>
         <View style={styles.mascotContainer}>
              <Image source={require('../../assets/mascot/tips.png')} style={styles.mascotStyle} resizeMode="contain"/>
            <View style={styles.speechBox}>
              <View style={styles.triangle} />
              <Text style={{fontFamily:'Fredoka-Regular',fontSize:20,color:'white',textAlign:'center'}}>
                Alright Then
              </Text>
                <Text style={{fontFamily:'Fredoka-Medium',fontSize:28,color:'white',textAlign:'center'}}>
                How Energized are you ?
              </Text>
              
            </View>
            </View>
      <View style={[styles.bulbContainer,globalStyle.container]}>
        {/* For Glow effect */}
        
        <View style={[styles.outerGlow,{opacity:sliderValue}]}/>
         <View style={[styles.outerGlow,{opacity:sliderValue}]}/>
        {/*Middle Glow*/}
            <View style={[styles.middleGlow,{opacity:sliderValue}]}/>
        <View style={[styles.innerGlow,{opacity:sliderValue}]} />
        {/*Where Bulb will be placed */}
        <View style={styles.bulbImageContainer}>
          <Image source={require('../../assets/icons/Bulbs/turnedoff.png')} style={styles.bulbSize} resizeMode='contain'/>
          <Image source={require('../../assets/icons/Bulbs/turnedon.png')} style={[styles.bulbSize,styles.bulbOpacity,{opacity:sliderValue }]} resizeMode='contain'/>
        </View>
        <Text style={{fontFamily:'Fredoka-Medium',fontSize:24,marginTop:20}}>{Math.round(sliderValue * 100)}%</Text>
        <Text>{energyValue}</Text>
      </View>
        <View style={globalStyle.container}>
         <Slider
                value={sliderValue}
                onValueChange={(value)=>handleSliderValue(value)}
                trackStyle={[
                  styles.sliderStyle,
                ]}
                thumbTouchSize={{ width: 40, height: 40 }}
                thumbStyle={{
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                }}
                animateTransitions={true}
                animationType="spring"
                thumbImage={require('../../assets/icons/Bulbs/energy.png')}
              
              />
              <Text style={{fontFamily:'JosefinSlab-SemiBold',marginTop:20,textAlign:'center'}}>Rate your energy through Slider</Text>
      <Button style={styles.button} mode='contained' onPress={()=>router.push('./thirdStep')}><Text
                        style={{
                          fontFamily: "Fredoka-Regular",
                          fontSize: 16,
                          textAlign: "center",
                          color: "#fff",
                          marginRight: 8,
                        }}
                      >
                        Continue
                      </Text></Button>
    </View>
    </View>
  )
}

export default secondStep

const styles = StyleSheet.create({
    bulbSize:{
      width:150,
      height:192
    },
    bulbImageContainer:{
      position:'relative'
    },
    bulbOpacity:{
      position:'absolute',
      top:0,
      left:0
    },
    bulbContainer:{
      width:300,
      height:300,
      alignContent:'center',
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
      marginTop:32
    },
    sliderStyle: {
    width: "100%",
    height: 50,
    borderRadius: 100,
  },
  outerGlow:{
     position:'absolute',
          top:0,
          width:272,
          height:264,
          shadowColor:'rgba(255, 115, 76, 1)',
          borderRadius:200,
          shadowRadius:100,
elevation: 25,

  },
  middleGlow:{
    position:'absolute',
          top:0,
          width:200,
          height:200,
          shadowColor:'rgba(219, 56, 6, 1)',
          borderRadius:200,
          shadowRadius:100,
elevation: 25
  },
  innerGlow:{
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 70,
    shadowColor: 'rgba(170, 23, 0, 1)',
    shadowRadius: 25,
    elevation: 10,
  },mascotStyle:{
      width:105,
      height:80,
      transform:[{rotate:"-34deg"},{scaleX:-1}],
      position:'absolute',
      top:0,
      right: -45,
    },
    mascotContainer:{
      position: 'relative',
      height: 120,
      marginTop: 30,
    },
    speechBox:{
      justifyContent:'center',
      backgroundColor: '#5E4C4B',
      borderRadius: 32,
      paddingVertical: 24,
      paddingHorizontal: 32,
      marginRight: 70, 
      marginLeft:28,
      marginTop: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    button: {
      marginTop: 24,
      backgroundColor: "#5E4C4B",
      borderRadius: 8,
      height: 56,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    triangle: {
      position: 'absolute',
      bottom: 80,
      right: -8,
      width: 20,
      height: 20,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 0,
      borderRightWidth: 16,
      borderBottomWidth: 16,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#5E4C4B',
      transform: [{ rotate: '-130deg' }],}
  })
