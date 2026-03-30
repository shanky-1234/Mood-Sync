import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import { Button } from 'react-native-paper'
import { useRouter } from 'expo-router'
import authService from '../Service/auth'

const ThirdPage = () => {
  const router = useRouter()


    
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
              Journals
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <View style={{ width: 250, height: 250 }}>
              <Image
                source={require("../../assets/icons/journal.png")}
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
           Had a bad day ? or an exciting one. Reflect upon your day or the situation you’re currently on.
Click on the analyze where our mood coach will help you. 
          </Text>
          <View style={globalStyle.container}>
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={{ fontFamily: "Fredoka-Regular" }}
              onPress={()=>router.push('./FinalPage')}
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
            {renderProgressDots(2)}
          </View>
        </View>
  )
}

export default ThirdPage

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
        marginTop:8
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