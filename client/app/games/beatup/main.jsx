import { Image, StyleSheet, Text, View ,Alert} from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import { backgroundMap } from '../../utils/backgroundLottie'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio'
import { useState } from 'react'
import { Colors } from '../../Constants/styleVariable'
import { Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const main = () => {
    const [slapScore,setSlapScore] = useState(0)
    const [angerScore,setAngerScore] = useState(0)
    const [photo,setPhoto] = useState(null)
    const {backgrounds} = useSelector((state)=>state.backgrounds)
    const slap1 = useAudioPlayer(require('../../../assets/audio/slapsound.mp3'));
const slap2 = useAudioPlayer(require('../../../assets/audio/slapsound2.mp3'));
const slap3 = useAudioPlayer(require('../../../assets/audio/slapsound3.mp3'));
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const rotation = useSharedValue(0)
    const rotateX = useSharedValue(0)
    const scale = useSharedValue(1)
    const slapEffectOpacity = useSharedValue(0)
    const slapEffectScale = useSharedValue(0.9)
    const slapEffectX = useSharedValue(0)
    const slapEffectY = useSharedValue(0)
    
    const playSlapSound = () =>{
        const sounds = [slap1, slap2, slap3];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

        try{
             randomSound.seekTo(0);
    randomSound.play();
        }catch(e){
            console.error('Slap Audio Error',e)
        }
    }

    const incrementSlapScore = () => {
      setSlapScore(prev => {
        const next = prev + 1
        if (next % 10 === 0) {
          setAngerScore(prevAnger => prevAnger + 1)
        }
        return next
      })
    }

    const imageUpload = async () =>{
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
          }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:['images'],
        allowsEditing:true,
        aspect:[1,1],
        quality:1 ,
        allowsMultipleSelection:false
      })
      
      if (!result.canceled) {
        console.log(result)
        setPhoto(result.assets[0].uri)
      }
    }

    const animatedStyle = useAnimatedStyle(()=>{
        return {
            transform:[
                    {translateX:translateX.value},
                    {translateY:translateY.value},
                     { rotate: `${rotation.value}deg` },
                     { rotateX: `${rotateX.value}deg` },
      { scale: scale.value },
            ]
        }
    })

    const slapEffectStyle = useAnimatedStyle(() => {
        return {
            opacity: slapEffectOpacity.value,
            transform: [
                { translateX: slapEffectX.value - 75 },
                { translateY: slapEffectY.value - 75 },
                { scale: slapEffectScale.value },
            ],
        }
    })

    const showSlapEffect = () => {
        'worklet'
        slapEffectOpacity.value = withSequence(
            withTiming(1, { duration: 40 }),
            withTiming(0, { duration: 180 })
        )
        slapEffectScale.value = withSequence(
            withTiming(1.2, { duration: 40 }),
            withTiming(1, { duration: 180 })
        )
    }

    const setSlapEffectPosition = (x, y) => {
        'worklet'
        slapEffectX.value = x
        slapEffectY.value = y
    }

    const handleSlap = () =>{
        'worklet'

       
        const xDirection = Math.random() > 0.5 ? -1 : 1; 
        const yDirection = Math.random() > 0.5 ? -1 : 1; 

        const xAmount = xDirection * (20 + Math.random() * 20); 
        const yAmount = yDirection * (15 + Math.random() * 15); 

        translateX.value = withSequence(
            withTiming(xAmount, { duration: 60 }),
    withTiming(-xAmount * 0.6, { duration: 100 }),
    withSpring(0, { damping: 8, stiffness: 100 })
        )

        translateY.value = withSequence(
            withTiming(yAmount, { duration: 60 }),
    withTiming(-yAmount * 0.6, { duration: 100 }),
    withSpring(0, { damping: 8, stiffness: 100 })
        )

        rotation.value = withSequence(
    withTiming(-15, { duration: 60 }),
    withTiming(10, { duration: 100 }),
    withSpring(0, { damping: 8, stiffness: 100 })
  );

  scale.value = withSequence(
    withTiming(0.88, { duration: 60 }),
    withTiming(1.12, { duration: 100 }),
    withSpring(1, { damping: 8, stiffness: 100 })
  );

    }
    const fallDown = () =>{
        'worklet'

        // Fall down with perspective
        translateY.value = withSequence(
            withTiming(100, { duration: 200 }),
            withSpring(0, { damping: 6, stiffness: 80 })
        )

        rotateX.value = withSequence(
            withTiming(90, { duration: 200 }),
            withSpring(0, { damping: 6, stiffness: 80 })
        )

        scale.value = withSequence(
            withTiming(0.8, { duration: 200 }),
            withSpring(1, { damping: 6, stiffness: 80 })
        )
    }

    const fallAway = () => {
        'worklet'
        translateY.value = withSequence(
            withTiming(800, { duration: 250 }),
            withTiming(0, { duration: 300 })
        )
        rotateX.value = withSequence(
            withTiming(90, { duration: 250 }),
            withTiming(0, { duration: 300 })
        )
        scale.value = withSequence(
            withTiming(0.7, { duration: 250 }),
            withSpring(1, { damping: 8, stiffness: 80 })
        )
    }

    const slideAway = (direction) => {
        'worklet'
        translateX.value = withSequence(
            withTiming(direction * 800, { duration: 250 }),
            withTiming(0, { duration: 300 })
        )
        rotation.value = withSequence(
            withTiming(direction * 25, { duration: 250 }),
            withTiming(0, { duration: 300 })
        )
        scale.value = withSequence(
            withTiming(0.7, { duration: 250 }),
            withSpring(1, { damping: 8, stiffness: 80 })
        )
    }
const triggerHaptics = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
}

   const tapGesture = Gesture.Tap().onEnd((event) => {
  'worklet';
  runOnJS(incrementSlapScore)();
  setSlapEffectPosition(event.x, event.y);
  showSlapEffect();
  runOnJS(playSlapSound)();
  runOnJS(triggerHaptics)();
  if (Math.random() < 0.3) {
    fallDown();
  } else {
    handleSlap();
  }
});

   const swipeDownGesture = Gesture.Fling().direction(Gesture.DIRECTION_DOWN).onEnd(() => {
  'worklet';
  fallAway();
  runOnJS(triggerHaptics)();
});

   const swipeLeftGesture = Gesture.Fling().direction(Gesture.DIRECTION_LEFT).onEnd(() => {
  'worklet';
  slideAway(-1);
  runOnJS(triggerHaptics)();
});

   const swipeRightGesture = Gesture.Fling().direction(Gesture.DIRECTION_RIGHT).onEnd(() => {
  'worklet';
  slideAway(1);
  runOnJS(triggerHaptics)();
});

   const gesture = Gesture.Simultaneous(tapGesture, swipeDownGesture, swipeLeftGesture, swipeRightGesture)
  return (
    <View style={styles.background}>
      <View style={styles.dummyView}>
            <LottieView source={backgroundMap[backgrounds]} autoPlay loop={true} style={{width:550,height:550,position:'absolute',bottom:-50,right:0,left:-50}}/>
            <LottieView source={require('../../../assets/Lottie/fire.json')} autoPlay loop={true} style={{opacity:angerScore/50,width:550,height:550,position:'absolute',bottom:80,right:0,left:-50}}/>
        <GestureDetector gesture={gesture}>
            <Animated.View style={styles.effectContainer}>
                <AnimatedImage source={require('../../../assets/game/dummy.png')} style={[styles.dummy,animatedStyle]} resizeMode='contain'/>
                {
                  photo && 
                  <Animated.Image 
                    source={{uri : photo}} 
                    resizeMode='cover' 
                    style={[styles.faceImage, animatedStyle]}
                  />
                }
                <AnimatedImage source={require('../../../assets/game/slapeffect.png')} style={[styles.slapEffect, slapEffectStyle]} resizeMode='contain' pointerEvents='none'/>
            </Animated.View>
        </GestureDetector>
        
      </View>
      <View>
        <View style={{flexDirection:'row',justifyContent:'center', marginTop:12, gap:8}}>
                <View
                            style={[styles.metricCard, { backgroundColor: Colors.primary }]}
                          >
                            <View style={{ zIndex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 24,
                                  fontFamily: "Fredoka-Bold",
                                  color: "#fff",
                                }}
                              >
                                {slapScore}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontFamily: "Fredoka-Regular",
                                  color: "#fff",
                                }}
                              >
                                Hit Score
                              </Text>
                            </View>
                          </View>
                           <View
                            style={[styles.metricCard, { backgroundColor: Colors.primary }]}
                          >
                            <View style={{ zIndex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 24,
                                  fontFamily: "Fredoka-Bold",
                                  color: "#fff",
                                }}
                              >
                                {angerScore}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontFamily: "Fredoka-Regular",
                                  color: "#fff",
                                }}
                              >
                                Anger Score
                              </Text>
                            </View>
                          </View>
        </View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
                  <Button style={[styles.button,{width:'40%',justifyContent:'center'}]} onPress={imageUpload}>
          <Text style={{fontFamily:'Fredoka-Medium',color:'white'}}>
            View Upload
          </Text>
        </Button>
      </View>
      </View>
    </View>
  )
}

export default main

const styles = StyleSheet.create({
    background:{
        flex:1,backgroundColor:'#FBE5E3'
    },
    dummyView:{
        marginTop:24,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    dummy:{
        width:400,
        height:400,
    },
    effectContainer:{
        width:400,
        height:400,
        position:'relative',
        justifyContent:'center',
        alignItems:'center',
    },
    slapEffect:{
        position:'absolute',
        width:100,
        height:100,
    },
    metricCard: {
    padding: 16,
    borderRadius: 12,
    position: "relative",

    justifyContent:'flex-start',
    alignItems:'flex-start',
    alignContent:'flex-start'
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
  faceImage: {
  position: 'absolute',
  width: 100,
  height: 100,
  borderRadius: 50,
  top: '-2%',
  left: '38%',
  zIndex: 10,
  borderWidth: 3,
  borderColor: '#fff',
}
})