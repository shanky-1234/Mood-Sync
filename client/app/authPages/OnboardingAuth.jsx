import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../Constants/styleVariable";
import { Button } from "react-native-paper";
import { globalStyle } from "../Constants/globalStyles";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import {useAudioPlayer} from 'expo-audio'

const OnboardingAuth = () => {
  const router = useRouter();
  const [play,setPlay ] = useState(true)
  const player = useAudioPlayer(require('../../assets/audio/ambient.mp3'))
  const playBackground = async() =>{
        try {
          console.log('Play')
          
          player.volume = 0.2
          player.play()
        
        } catch (error) {
         console.log("Error loading sound:", error);
        }
      }
      useEffect(()=>{
        if(play){
          playBackground()
        }
        return
      },[])

  return (
    <View style={{ flex: 1, backgroundColor: "#FFEDED" }}>
      <View style={styles.topContainer}>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Fredoka-Bold",
            fontSize: 48,
            color: "#fff",
          }}
        >
          Hello, This is
        </Text>
      </View>
      <View style={styles.logoContainer}>
        <View style={{ width: 200, height: 200 }}>
          <Image
            source={require("../../assets/logos/moodSyncLogo.png")}
            style={{ width: "100%", height: "100%", zIndex: 4 }}
          />
          <View style={styles.backgroundImage}>
              <LottieView source={require('../../assets/Lottie/clouds.json')} autoPlay loop={true} style={{width:500,height:500,position:'absolute',bottom:30,right:0,left:-50}}/>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontFamily: "Fredoka-Regular",
          color: Colors.primary,
          width: 250,
          fontSize: 20,
          alignSelf: "center",
          marginTop: 40,
        }}
      >
        I will help you take care of your emotions and moods
      </Text>
      <View style={globalStyle.container}>
        <Button
          mode="contained"
          style={styles.button}
          
          labelStyle={{ fontFamily: "Fredoka-Regular" }}
          onPress={()=>router.replace('./Login')}
        >
          Log-In
        </Button>
        <Button
          mode="text"
          labelStyle={{
            fontFamily: "Fredoka-Regular",
            color: Colors.primary,
            marginTop: 16,
          }}
        >
          Create Account
        </Button>
      </View>
    </View>
  );
};

export default OnboardingAuth;

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: Colors.primary,
    minHeight: "25%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: "10%",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  logoContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingTop: "20%",
    position: "relative",
  },
  backgroundImage: {
    width: 400,
    height: 166,
    justifyContent: "center",
    position: "absolute",
    zIndex: 3,
    left: -100,
    bottom:-120
  },
  button: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
  },
});
