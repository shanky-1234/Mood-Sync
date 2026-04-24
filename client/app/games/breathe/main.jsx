import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-native-paper';
import { Colors } from '../../Constants/styleVariable';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;

const BreathingGame = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [count, setCount] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            setPhase((currentPhase) => {
              if (currentPhase === 'ready') return 'inhale';
              if (currentPhase === 'inhale') return 'hold';
              if (currentPhase === 'hold') return 'exhale';
              if (currentPhase === 'exhale') {
                setCycleCount((c) => c + 1);
                return 'inhale';
              }
              return currentPhase;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

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
    setPhase('inhale');
    setCount(4);
    setCycleCount(0);
    setIsActive(true);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setPhase('ready');
    setCount(4);
  };

  const goBack = () => {
    setIsActive(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Background animation */}
      {isActive && (
        <LottieView
          source={require('../../../assets/Lottie/clouds.json')}
          autoPlay
          loop
          style={styles.backgroundAnimation}
        />
      )}

      <View style={styles.content}>
        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <Image
            source={require('../../../assets/mascot/cheerful.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        {/* Breathing Circle */}
        <View style={styles.circleContainer}>
          <View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: getCircleScale() }],
              },
            ]}
          >
            <Text style={styles.phaseText}>{getPhaseText()}</Text>
            {isActive && <Text style={styles.countText}>{count}</Text>}
          </View>
        </View>

        {/* Instructions */}
        <Text style={styles.instruction}>
          {isActive
            ? `Cycle ${cycleCount + 1}`
            : 'Follow the circle to regulate your breathing'}
        </Text>

        {/* Timer info */}
        <View style={styles.timerInfo}>
          <View style={styles.timerItem}>
            <Text style={styles.timerLabel}>Inhale</Text>
            <Text style={styles.timerValue}>4s</Text>
          </View>
          <View style={styles.timerItem}>
            <Text style={styles.timerLabel}>Hold</Text>
            <Text style={styles.timerValue}>4s</Text>
          </View>
          <View style={styles.timerItem}>
            <Text style={styles.timerLabel}>Exhale</Text>
            <Text style={styles.timerValue}>4s</Text>
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
          <Button
            mode="outlined"
            onPress={goBack}
            style={styles.backButton}
            textColor={Colors.primary}
          >
            <Text style={styles.backButtonText}>Back to Stats</Text>
          </Button>
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
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
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