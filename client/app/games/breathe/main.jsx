import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors } from '../../Constants/styleVariable';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useAudioPlayer } from 'expo-audio';


const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;

const BreathingGame = () => {
  const BREATHING_TIME ={
    inhale:4,
    hold:2,
    exhale:6
  }
  const BREATHE_MASCOT = {
    inhale :require( '../../../assets/mascot/breathein.png'),
    hold:require( '../../../assets/mascot/breathein.png'),
    exhale:require('../../../assets/mascot/breatheout.png')
  }
  const router = useRouter();
  const [play,setPlay] = useState(false)
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); 
  const [count, setCount] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const audioPlayer = useAudioPlayer(require('../../../assets/audio/breathegame.mp3'))

  const playBackgroundMusic = async()=>{
    try{
      audioPlayer.volume=0.3
      audioPlayer.loop=true
      audioPlayer.seekTo(0)
      audioPlayer.play()

    }
    catch(e){
      console.error(e)
    }

  }

  const stopBackgroundMusic = async()=>{
    try{
      audioPlayer.pause()

    }
    catch(e){
      console.error(e)
    }
  }
  const getDuration = (phase)=>{
    return BREATHING_TIME[phase] || 4
  }

  const getNextPhase = (currentPhase) =>{
    if(currentPhase === 'inhale') return 'hold'
     if (currentPhase === 'hold') return 'exhale';
    if (currentPhase === 'exhale') return 'inhale';
    return 'inhale';
  }

  useEffect(() => {
    let interval;
    if (play){
      playBackgroundMusic()
    }else{
      stopBackgroundMusic()
    }
    if (isActive) {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            setPhase((currentPhase)=>{
              const nextPhase = getNextPhase(currentPhase)
 
               if (currentPhase === 'exhale') {
              setCycleCount((c) => c + 1);
            }

            setCount(getDuration(nextPhase))
            return nextPhase
            })

            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive,play]);

  useEffect(() => {
    let idleLoop;
    if (isActive) {
      const targetValue = phase === 'exhale' ? 0 :1;
      Animated.timing(floatAnim, {
        toValue: targetValue,
        duration: getDuration(phase) * 1000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }).start();
    } else {
      idleLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      idleLoop.start();
    }

    return () => {
      if (idleLoop) {
        idleLoop.stop();
      }
    };
  }, [isActive, phase, floatAnim]);

  const getPhaseText = () => {
    switch (phase) {
      case 'ready':
        return 'Ready?';
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
      default:
        return '';
    }
  };

  const getCircleScale = () => {
    if (phase === 'inhale') {
      return 1 + (4 - count) / 4 * 0.3; // Scale from 1 to 1.3
    }
    if (phase === 'hold') {
      return 1.3;
    }
    if (phase === 'exhale') {
      return 1.3 - (4 - count) / 4 * 0.3; // Scale from 1.3 to 1
    }
    return 1;
  };

  const startBreathing = () => {
    setPlay(true)
    setPhase('inhale');
    setCount(BREATHING_TIME.inhale);
    setCycleCount(0);
    setIsActive(true);
  };

  const stopBreathing = () => {
    setPlay(false)
    setIsActive(false);
    setPhase('ready');
    setCount(BREATHING_TIME.inhale);
  };

  const goBack = () => {
    setIsActive(false);
    router.back();
  };

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const floatScale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.025],
  });

  return (
    <View style={styles.container}>
      {/* Background animation */}


      <View style={styles.content}>
        <Animated.View style={[styles.mascotContainer, { transform: [{ translateY: floatTranslate }, { scale: floatScale }] }]}> 
          { !isActive ?
          <Image source={require('../../../assets/mascot/breathedefault.png')} style={styles.mascot} resizeMode='contain'/> :
          (
            <Image source={BREATHE_MASCOT[phase]} style={styles.mascot} resizeMode='contain'/>
          )
          }
        </Animated.View>
        <View style={{marginBottom:12}}>
          <Text style={{fontFamily:'Fredoka-Bold',color:Colors.primary,fontSize:28}}>{phase.toUpperCase()}</Text>
        </View>
        {/* Instructions */}
        <Text style={styles.instruction}>
          {isActive
            ? `Cycle ${cycleCount + 1}`
            : 'Follow the circle to regulate your breathing. Focus on your breathing'}
        </Text>

        {/* Timer info */}
        <View style={styles.timerInfo}>
          <View style={styles.timerItem}>
            <Text style={styles.timerLabel}>Inhale</Text>
            <Text style={styles.timerValue}>4s</Text>
          </View>
             <View style={styles.timerItem}>
            <Text style={styles.timerLabel}>Hold</Text>
            <Text style={styles.timerValue}>2s</Text>
          </View>
          <View style={styles.timerItem}>
            <Text style={styles.timerLabel}>Exhale</Text>
            <Text style={styles.timerValue}>6s</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {!isActive ? (
            <Button
              mode="contained"
              onPress={startBreathing}
              style={styles.startButton}
              buttonColor={Colors.primary}
              textColor="white"
            >
              <Text style={styles.buttonText}>Start Breathing</Text>
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={stopBreathing}
              style={styles.stopButton}
              buttonColor={Colors.secondary}
              textColor="white"
            >
              <Text style={styles.buttonText}>Stop</Text>
            </Button>
          )}
  
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBE7E5',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mascotContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  breathingCircle: {
    width: CIRCLE_SIZE * 0.7,
    height: CIRCLE_SIZE * 0.7,
    borderRadius: CIRCLE_SIZE * 0.35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  phaseText: {
    fontFamily: 'Fredoka-Medium',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  countText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 48,
    color: 'white',
    marginTop: 5,
  },
  instruction: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  timerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  timerItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerLabel: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 14,
    color: Colors.secondary,
  },
  timerValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: Colors.primary,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  startButton: {
    width: '80%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
  },
  stopButton: {
    width: '80%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
  },
  backButton: {
    width: '80%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  buttonText: {
    fontFamily: 'Fredoka-Medium',
    fontSize: 18,
  },
  backButtonText: {
    fontFamily: 'Fredoka-Medium',
    fontSize: 16,
  },
});

export default BreathingGame;