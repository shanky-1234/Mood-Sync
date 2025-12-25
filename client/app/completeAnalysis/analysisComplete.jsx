import { StyleSheet, Text, View, Image } from "react-native";
import { Badge, ProgressBar, Button,ActivityIndicator } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from 'expo-router'
import { useEffect,useState} from "react";
import { useCheckIn } from "../Context/CheckinContext";
import { globalStyle } from "../Constants/globalStyles";
import { Colors } from "../Constants/styleVariable";
import RewardTrackerCard from "../components/RewardTrackerCard";
import LottieView from 'lottie-react-native';
import { useStoredCheckIn } from "../Context/StoredCheckIn";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/slices/authSlice";
import { useAudioPlayer } from "expo-audio";


export default function analysisComplete() {

  const router = useRouter()
  const {checkInResult} = useStoredCheckIn()
  const {isLoading} = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  const { state } = useCheckIn();

    const [play,setPlay ] = useState(true)
      const player = useAudioPlayer(require('../../assets/audio/complete.mp3'))
      const playBackground = async() =>{
            try {
              console.log('Play')
              
              player.volume = 0.5
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
  useEffect(() => {

      loadCheckInResult()
    console.log(state);
    console.log(checkInResult)
  }, [state]);

  const loadCheckInResult = async() =>{
    if(!checkInResult){
      dispatch(setLoading(true))
    }
    dispatch(setLoading(false))
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <View
      style={[globalStyle.container, { backgroundColor: "#FCE9E7", flex: 1 }]}
    >
      <LottieView source={require('../../assets/Lottie/Confetti.json')} autoPlay loop={false} style={{position:'absolute', width: 1000, height:600,top:0,left:0,zIndex:999 }}/>
      <View style={{ gap: 1, marginTop: 48 }}>
        <Text
          style={{
            fontFamily: "Fredoka-Semibold",
            fontSize: 28,
            textAlign: "center",
            color: Colors.secondary,
          }}
        >
          Check In
        </Text>
        <Text
          style={{
            fontFamily: "Fredoka-Bold",
            fontSize: 42,
            textAlign: "center",
            color: Colors.primary,
          }}
        >
          COMPLETED
        </Text>
        <View>
          <Text
            style={{
              fontFamily: "Fredoka-Regular",
              fontSize: 20,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            Keep Going
          </Text>
        </View>
        <View
          style={{
            maxWidth: 400,
            maxHeight: 160,
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <Image
            source={require("../../assets/mascot/task_completed.png")}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={style.badgeContainer}>
          <Badge style={style.badgeStyle}>
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
                {checkInResult?.gamification?.checkInStreak?.current}
              </Text>
            </View>
          </Badge>
        </View>
        <View
          style={{
            marginVertical: 16,
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Fredoka-Medium",
              color: Colors.primary,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Level Progress
          </Text>
          <ProgressBar
            theme={{ colors: { primary: "#00E038" } }}
            style={{ marginTop: 8 }}
            progress={checkInResult?.gamification?.currentExp/checkInResult?.gamification?.expToNextLevel}
            
          />
          <View>
            <Text style={{ fontFamily: "JosefinSlab-Bold" }}>{checkInResult?.gamification?.currentExp}/{checkInResult?.gamification?.expToNextLevel}</Text>
          </View>
        </View>
        <View>
          <RewardTrackerCard />
        </View>
        <View style={{gap:12, marginTop:28}}>
          <Button
            mode="contained"
            style={style.button}
            labelStyle={{ fontFamily: "Fredoka-Regular" }}
          >
            <Text>Analysis</Text>
          </Button>
           <Button
            mode="outlined"
            style={[style.button,{backgroundColor:'transparent',borderColor:Colors.primary}]}
            labelStyle={{ fontFamily: "Fredoka-Regular",color:Colors.primary}}
            onPress={()=>router.replace('../(tabs)')}
          >
            <Text>Back To Home</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 12,
  },
  badgeStyle: {
    width: 64,
    height: 28,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
  },
});
