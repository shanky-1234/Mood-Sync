import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import StepProgress from "../components/StepProgress";
import { globalStyle } from "../Constants/globalStyles";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { Slider } from "@miblanchard/react-native-slider";
import { Colors } from "../Constants/styleVariable";

const firstStep = () => {
  const [sliderValue, setSliderValue] = useState(Number(0.5));
  const [emotion,setEmotion] = useState('neutral')
  const currentStep = 0;
  const router = useRouter();
  const handleLinking = () => {
    router.back();
  };

  const handleSlideValue = (value) =>{
    setSliderValue(value)
    // Handle Information Disply
    sliderValue >= 0.3 && sliderValue < 0.5
                  ? setEmotion('sad')
                  : sliderValue >= 0.5 && sliderValue < 0.7
                  ? setEmotion('neutral')
                  : sliderValue >= 0.7 && sliderValue < 1
                  ? setEmotion('happy')
                  : sliderValue == 1
                  ? setEmotion('excellent')
                  : setEmotion('worst')
  }

// Handle Showing emotion characters
  const emotionImage = {
    sad:require('../../assets/icons/EmotionEmoji/Sad.png'),
    veryHappy:require('../../assets/icons/EmotionEmoji/veryhappy.png'),
    verySad:require('../../assets/icons/EmotionEmoji/verysad.png'),
    neutral:require('../../assets/icons/EmotionEmoji/neutral.png'),
    happy:require('../../assets/icons/EmotionEmoji/Happy.png')
  }

  return (
    <View style={[styles.mainContainer]}>
      <View style={{paddingHorizontal:28, marginTop:28}}>
        <StepProgress currentStep={currentStep} progressLink={handleLinking} />
      </View>
      <View style={styles.mascotContainer}>
        <Image source={require('../../assets/mascot/tips.png')} style={styles.mascotStyle} resizeMode="contain"/>
      <View style={styles.speechBox}>
        <View style={styles.triangle} />
        <Text style={{fontFamily:'Fredoka-Regular',fontSize:20,color:'white',textAlign:'center'}}>
          Hello Username
        </Text>
          <Text style={{fontFamily:'Fredoka-Medium',fontSize:28,color:'white',textAlign:'center'}}>
          How are you 
feeling Today ?
        </Text>
        
      </View>
      </View>
      <View style={{paddingHorizontal:28, marginTop:60}}>
        <Image source={sliderValue >= 0.3 && sliderValue < 0.5
                  ? emotionImage.sad
                  : sliderValue >= 0.5 && sliderValue < 0.7
                  ? emotionImage.neutral
                  : sliderValue >= 0.7 && sliderValue < 1
                  ? emotionImage.happy
                  : sliderValue == 1
                  ? emotionImage.veryHappy
                  : emotionImage.verySad} resizeMode="contain" style={{width:143,height:143,alignSelf:'center'}}/>
      <Text style={{textAlign:'center', fontFamily:'Fredoka-Bold', fontSize:24, color:
                sliderValue >= 0.3 && sliderValue < 0.5
                  ? "#d9b1ee"
                  : sliderValue >= 0.5 && sliderValue < 0.7
                  ? "#FFD835"
                  : sliderValue >= 0.7 && sliderValue < 1
                  ? "#50E19D"
                  : sliderValue == 1
                  ? "#007940"
                  : "#FF7635", marginTop:20}}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</Text>
      </View>
      <View style={{ paddingHorizontal:28, marginTop:28}}>
        <Slider
          trackStyle={[
            styles.sliderStyle,
            {
              backgroundColor:
                sliderValue >= 0.3 && sliderValue < 0.5
                  ? "#d9b1ee"
                  : sliderValue >= 0.5 && sliderValue < 0.7
                  ? "#FFD835"
                  : sliderValue >= 0.7 && sliderValue < 1
                  ? "#50E19D"
                  : sliderValue == 1
                  ? "#007940"
                  : "#FF7635",
            },
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
          thumbImage={
            sliderValue >= 0.3 && sliderValue < 0.5
              ? require("../../assets/icons/sliderBad.png")
              : sliderValue >= 0.5 && sliderValue < 0.7
              ? require("../../assets/icons/slider.png")
              : sliderValue >= 0.7 && sliderValue < 1
              ? require("../../assets/icons/sliderGood.png")
              : sliderValue == 1
              ? require("../../assets/icons/sliderVerygood.png")
              : require("../../assets/icons/sliderWorst.png")
          }
          value={sliderValue}
          
          animateTransitions={true}
          animationType="spring"
          onValueChange={(value)=>handleSlideValue(value)}
          minimumTrackTintColor={
            sliderValue >= 0.3 && sliderValue < 0.5
              ? "#d9b1ee"
              : sliderValue >= 0.5 && sliderValue < 0.7
              ? "#FFD835"
              : sliderValue >= 0.7 && sliderValue < 1
              ? "#50E19D"
              : sliderValue == 1
              ? "#007940"
              : "#FF7635"
          }
        />
        <Text style={{fontFamily:'JosefinSlab-SemiBold',marginTop:20,textAlign:'center'}}>Rate your mood through Slider</Text>
        <Button mode="contained" style={styles.button} onPress={()=>router.push('./secondStep')}><Text
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
  );
};

export default firstStep;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FCE9E7",
    flex: 1,
  },
  sliderStyle: {
    width: "100%",
    height: 50,
    borderRadius: 100,
  },
  mascotStyle:{
    width:105,
    height:80,
    transform:[{rotate:"34deg"}],
    position:'absolute',
    top:0,
    left: -45,
  },
  mascotContainer:{
    position: 'relative',
    height: 120,
    marginTop: 60,
  },
  speechBox:{
    justifyContent:'center',
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginLeft: 70, 
    marginRight:28,
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
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  triangle: {
    position: 'absolute',
    bottom: 80,
    left: -8,
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderRightWidth: 16,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primary,
    transform: [{ rotate: '50deg' }],}
});
