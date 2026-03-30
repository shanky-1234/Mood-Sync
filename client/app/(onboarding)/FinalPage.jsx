import { Image, StyleSheet, Text, View, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import { Badge, Button } from 'react-native-paper'
import { useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import authService from '../Service/auth'

const FinalPage = () => {
  const router = useRouter()

  const handleFinal = async()=>{
        
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
              Mood Check Made Fun
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <Badge style={styles.badgeStyle}>
                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <MaterialCommunityIcons name="fire" size={24} color="white" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Fredoka-Bold",
                      color: "white",
                    }}
                  >
                    +1
                  </Text>
                </View>
              </Badge>
               <Badge style={styles.badgeStyleTwo}>
                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{
                      fontSize: 16,
                      fontFamily: "Fredoka-Bold",
                      color: "white",
                    }}>EXP</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Fredoka-Bold",
                      color: "white",
                    }}
                  >
                    +1
                  </Text>
                </View>
              </Badge>
            <View style={{ width: 250, height: 250 }}>
              <Image
                source={require("../../assets/mascot/task_completed.png")}
                style={{ width: "100%", height: "100%", zIndex: 4 }}
                resizeMode='contain'
              />
        
            </View>
            <View style={{ width: 70, height:70, position:'absolute', left:30, bottom:30, transform:[{rotate:'25deg'}] }}>
              <Image
                source={require("../../assets/icons/rewards.png")}
                style={{ width: "100%", height: "100%", zIndex: 4 }}
                resizeMode='contain'
              />
        
            </View>
          </View>
          <Text
            style={{
              fontFamily: "Fredoka-Regular",
              color: Colors.primary,
              width: 300,
              fontSize: 16,
              alignSelf: "center",
              marginTop: 12,
              textAlign:'center'
            }}
          >
          Complete Daily Rewards, Earn EXP, Level Up and maintain streaks 
          </Text>
          <View style={globalStyle.container}>
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={{ fontFamily: "Fredoka-Regular" }}
              onPress={handleFinal}
            >
              Continue
            </Button>
            {renderProgressDots(3)}
          </View>
        </View>
  )
}

export default FinalPage

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
        marginTop:40
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
       badgeStyle: {
    width: 64,
    height: 28,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 28,
    position:'absolute',
    top:20,
    left:50,
    backgroundColor:Colors.primary
  },
   badgeStyleTwo: {
    width: 64,
    height: 28,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 28,
    position:'absolute',
    top:20,
    right:50,
    backgroundColor:Colors.primary
  }
})