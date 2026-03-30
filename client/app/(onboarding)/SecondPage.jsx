import { Image, StyleSheet, Text, View, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import { Button } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import authService from '../Service/auth'

const SecondPage = () => {
  const floatAnim = useRef(new Animated.Value(0)).current
  const happyAnim = useRef(new Animated.Value(0)).current
  const sadAnim = useRef(new Animated.Value(0)).current
    
    const handleSkip = async()=>{
      
          try {
        const response = await authService.completeOnboarding()
        if (response.success) {
          console.log(response)
          router.replace('/(tabs)')
        }
  
      } catch (error) {
        console.error(error);
      }
  }

  const renderProgressDots = (activeStep) => {
    const total = 4
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeStep ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    )
  }

  useEffect(() => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    )

    const happyFloating = Animated.loop(
      Animated.sequence([
        Animated.timing(happyAnim, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(happyAnim, {
          toValue: 0,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    )

    const sadFloating = Animated.loop(
      Animated.sequence([
        Animated.timing(sadAnim, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sadAnim, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    )

    floating.start()
    happyFloating.start()
    sadFloating.start()

    return () => {
      floating.stop()
      happyFloating.stop()
      sadFloating.stop()
    }
  }, [floatAnim, happyAnim, sadAnim])

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  })

  const happyTranslate = happyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  })

  const sadTranslate = sadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  })

  const router = useRouter()
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
              Check Ins
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <View style={{ width: 150, height: 150 }}>
              <Animated.Image
                source={require("../../assets/mascot/logomascot.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: 4,
                  transform: [{ translateY: floatTranslate }],
                }}
                resizeMode='contain'
              />
        
            </View>
            <View style={{flexDirection:'row', gap:12}}>
                  <View style={{ width: 120, height: 120 }}>
              <Animated.Image
                source={require("../../assets/icons/EmotionEmoji/Happy.png")}
                style={{ width: "100%", height: "100%", zIndex: 4, transform:[{translateY: happyTranslate},{rotate:'-20deg'}] }}
                resizeMode='contain'
              />
        
            </View>
              <View style={{ width: 100, height: 100 }}>
              <Animated.Image
                source={require("../../assets/icons/EmotionEmoji/Sad.png")}
                style={{ width: "100%", height: "100%", zIndex: 4, transform:[{translateY: sadTranslate},{rotate:'20deg'}] }}
                resizeMode='contain'
              />
        
            </View>
            </View>
          </View>
          <Text
            style={{
              fontFamily: "Fredoka-Regular",
              color: Colors.primary,
              width: 300,
              fontSize: 16,
              alignSelf: "center",
              marginTop: 20,
              textAlign:'center'
            }}
          >
            5 Question to reflect upon yourselves. Get Quick analyses and tips to improve
          </Text>
          <View style={globalStyle.container}>
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={{ fontFamily: "Fredoka-Regular" }}
              onPress={()=>router.push('./ThirdPage')}
            >
              Continue
            </Button>
            <Button
              mode="text"
              labelStyle={{
                fontFamily: "Fredoka-Regular",
                color: Colors.primary,
                marginTop: 16,
              }}
               onPress={handleSkip}
            >
              Skip
            </Button>
            {renderProgressDots(1)}
          </View>
        </View>
  )
}

export default SecondPage

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
        position: "relative",
        marginTop:20
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
      progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
      },
      activeDot: {
        backgroundColor: Colors.primary,
      },
      inactiveDot: {
        backgroundColor: '#d1d1d1',
      },
})