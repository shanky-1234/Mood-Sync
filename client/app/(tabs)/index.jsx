import { Link, useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  ScrollViewComponent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, Avatar, Badge, Button,ProgressBar } from "react-native-paper";
import LottieView from 'lottie-react-native';
import { Colors } from "../Constants/styleVariable";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RewardTrackerCard from '../components/RewardTrackerCard'
import MoodCoach from '../components/MoodCoach'
import { useAudioPlayer } from "expo-audio";
import getCurrentDate from "../utils/getCurrentDate";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToken, setUser } from "../redux/slices/authSlice";
import { fetchAndUpdateUser } from "../utils/fetchandupdatedata";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCheckInInfo } from "../redux/slices/checkinSlice";

import MoodSyncMascot from "../components/pages/MoodSyncMascot";

export default function Index() {
  const [loggedInfo,setLoggedInfo] = useState(null) 
  const [checkInInfos,setCheckInInfos] = useState(null)
  const [week, setWeek] = useState(null);
  const [month, setMonth] = useState(""); // Set The Current Month
  const [time,setTime] = useState(null)
  const router = useRouter()
 const dispatch = useDispatch()
 

   const player = useAudioPlayer(require('../../assets/audio/start.mp3'))
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
          
            playBackground()
            
          
          },[])
  const{userInfo} = useSelector((state)=>state.auth)
  const {checkInInfo} = useSelector((state)=>state.checkIn)
  const {journalInfo} = useSelector((state)=>state.journal) // Get from slices and states

  const date = getCurrentDate(); // Get The Current Date Information (Today)
  const fill =20


useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const updateUser = async () => {
      const user = await fetchAndUpdateUser(dispatch);

      if (!user && isActive) {
        router.replace("/authPages/Login");
      } else if (user && isActive) {
        setLoggedInfo(user);

     
        if (user.checkInInfo) {
          dispatch(setCheckInInfo(user.checkInInfo));
        }

        getMonth();
        displayCurrentWeek();
        getTime();
      }
    };

    updateUser();

    return () => {
      isActive = false;
    };
  }, [])
);


  // Function to get the current month
  const getMonth = () => {
    const month = new Date().toLocaleString("en-US", { month: "long" });
    setMonth(month);
  };

  //Function to get the current week and display dates accoring to it
  const displayCurrentWeek = () => {
    const today = new Date();
    const getTodayDay = today.getDay(); // Gets The current Day
    const startOfWeek = new Date(today); // So the week always starts with sunday and the date changes accordingly
    startOfWeek.setDate(today.getDate() - getTodayDay);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i); //Gets All the week and the days

      week.push({
        id: i.toString(),
        day: currentDate.toLocaleDateString("en-US", { weekday: "short" }),
        date: currentDate.getDate().toString().padStart(2, "0"),
        fullDate: currentDate.toISOString().split("T")[0],
        isToday:
          currentDate.getDate() === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear(),
      });
    }

    setWeek(week);
    console.log(week);
  };

  const getTime = () =>{
    const date = new Date()
    const getTime = date.getHours()
    setTime(getTime)
   
  }


  
  return (
    <>
      <ScrollView style={{ flex: 1, }} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
        <Appbar.Header style={[style.headerStyle]} statusBarHeight={8}>
          <TouchableOpacity style={{ marginHorizontal: 28 }} onPress={()=>router.replace('/(profile)/ProfilePage')}>
            <View style={{ borderRadius: 50 }}>
              <Image
                source={require("../../assets/icons/default-profile-pic.png")}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
            </View>
          </TouchableOpacity>
          <Appbar.Action icon="bell-outline" color={Colors.primary} />
        </Appbar.Header>
        <View style={[style.mainContainer]}>
          <View
            style={{
              marginTop: 28,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{ fontFamily: "JosefinSlab-SemiBold", fontSize: 16 }}
              >
                {date}
              </Text>
              <Text style={style.headingTitle}>{
                time <= 12  ? "Good Morning" : time<18 ?  "Good Afternoon":"Good Evening"
                }</Text>
              <Text style={style.subTitle}>{userInfo ? userInfo.fullname : 'Username'}</Text>
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
                    {userInfo?.streaks?.current}
                  </Text>
                </View>
              </Badge>
              
            </View>
          </View>
          <View style={style.miniProgressCalender}>
            <Text
              style={{
                fontFamily: "JosefinSlab-SemiBold",
                fontSize: 16,
                textAlign: "center",
                color: "#fff",
              }}
            >
              {month}
            </Text>

            <FlatList
              data={week}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                marginTop: 8,
              }}
               scrollEnabled={false}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity>
                    <View
                      style={[
                        style.dateStyle,
                        item.isToday && style.activeDate,
                      ]}
                    >
                      <Text
                        style={[
                          { fontFamily: "JosefinSlab-SemiBold" },
                          item.isToday && { color: "#fff" },
                        ]}
                      >
                        {item.day}
                      </Text>
                      <Text
                        style={[
                          { fontFamily: "Fredoka-Regular" },
                          item.isToday && { color: "#fff" },
                        ]}
                      >
                        {item.date}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
         
          </View>
           <View style={{marginVertical:16,backgroundColor:'#fff',padding:16,borderRadius:12,shadowOpacity:4,elevation:2}}>
            <Text style={{fontFamily:'Fredoka-Medium',color:Colors.primary,fontSize:20,textAlign:'center'}}>Your Level: {userInfo?.currentLvl}</Text>
              <ProgressBar progress={userInfo?.currentExp/userInfo?.maxExp} theme={{ colors: { primary: '#00E038' } }} style={{marginTop:8}}  />
              <View>
                <Text style={{fontFamily:'JosefinSlab-Bold'}}>{userInfo?.currentExp}/{userInfo?.maxExp}</Text>
              </View>
          </View>
          <View style={{ marginTop: 28, position:'relative' }}>
            <LottieView source={require('../../assets/Lottie/clouds.json')} autoPlay loop={true} style={{width:500,height:500,position:'absolute',bottom:30,right:0,left:-50}}/>
            
            <MoodSyncMascot mood={userInfo?.lastMoodScore || 55} energy={userInfo?.lastEnergyScore || 50}/>
            <Button style={style.button}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Fredoka-Regular",
                    fontSize: 16,
                    textAlign: "center",
                    color: "#fff",
                    marginRight: 8,
                  }}
                >
                  Full Analysis
                </Text>
                <AntDesign name="arrow-right" size={16} color="#fff" />
              </View>
            </Button>
          </View>
          <View style={{ marginTop: 28 }}>
            <Text
              style={{
                fontFamily: "Fredoka-Medium",
                fontSize: 24,
                color: Colors.primary,
              }}
            >
              Todays Analysis
            </Text>
            <View style={{ flexDirection: "row", width: "100%", gap: 12, marginTop:16 }}>
              <View
                style={[style.metricCard, { backgroundColor: Colors.primary }]}
              >
                <View style={{ zIndex: 1 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: "Fredoka-Bold",
                      color: "#fff",
                    }}
                  >
                    {journalInfo?.countJournal}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Fredoka-Regular",
                      color: "#fff",
                    }}
                  >
                    Journal Entries Done
                  </Text>
                </View>
                <Image
                  source={require("../../assets/icons/notebook.png")}
                  style={{
                    width: 40,
                    height: 40,
                    position: "absolute",
                    right: 16,
                    top: 12,
                  }}
                />
              </View>
              <View style={[style.metricCard, { backgroundColor: "#FF7F6E" }]}>
                <View style={{ zIndex: 1 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: "Fredoka-Bold",
                      color: "#fff",
                    }}
                  >
                    {checkInInfo?.countCheckIn}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Fredoka-Regular",
                      color: "#fff",
                    }}
                  >
                    Check-Ins{'\n'}
                    <Text>Done</Text>
                  </Text>
                </View>
                <Image
                  source={require("../../assets/icons/notebook.png")}
                  style={{
                    width: 40,
                    height: 40,
                    position: "absolute",
                    right: 16,
                    top: 12,
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{marginTop:28}}>
            <Text
              style={{
                fontFamily: "Fredoka-Medium",
                fontSize: 24,
                color: Colors.primary,
              }}
            >
              Mood Metrics
            </Text>
            <ScrollView style={{width: "100%", gap: 12, marginTop:16}} horizontal={true} contentContainerStyle={{gap:12}} showsHorizontalScrollIndicator={false}>
            <View style={[style.metricCard, { backgroundColor: Colors.primary }]}>
     <View style={{flexDirection:'row',alignItems:'center'}}>
       <AnimatedCircularProgress
  size={80}
  width={8}
  fill={userInfo?.lastMoodScore}
  tintColor={Colors.primary}
  onAnimationComplete={() => console.log('onAnimationComplete')}
  padding={8}
  rotation={0}
  backgroundWidth={12}
  backgroundColor="#fff" >
    {
      (fill)=>(
        <Text style={{fontFamily:'Fredoka-Medium',fontSize:16, color:'#fff'}}>{userInfo?.lastMoodScore}</Text>
      )
    }
    </AnimatedCircularProgress>
    <AntDesign name="arrow-up" size={24} color="#fff"/>
    </View>
    <Text style={{fontSize:16, fontFamily:'Fredoka-Regular', color:'white'}}>
      Mood Score
    </Text>
    </View>
     <View style={[style.metricCard, { backgroundColor: '#5E4C4B' }]}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
       <AnimatedCircularProgress
  size={80}
  width={8}
  fill={userInfo?.lastEnergyScore}
  tintColor='#5E4C4B'
  onAnimationComplete={() => console.log('onAnimationComplete')}
  padding={8}
  rotation={0}
  backgroundWidth={12}
  backgroundColor="#fff" >
    {
      (fill)=>(
        <Text style={{fontFamily:'Fredoka-Medium',fontSize:16, color:'#fff'}}>{userInfo?.lastEnergyScore}</Text>
      )
    }
    </AnimatedCircularProgress>
    <AntDesign name="arrow-up" size={24} color="#fff"/>
    </View>
    <Text style={{fontSize:16, fontFamily:'Fredoka-Regular', color:'white'}}>
      Energy Score
    </Text>
    </View>
       <View style={[style.metricCard, { backgroundColor: Colors.secondary }]}>
         <View style={{flexDirection:'row',alignItems:'center'}}>
       <AnimatedCircularProgress
  size={80}
  width={8}
  fill={fill}
  tintColor={Colors.secondary}
  onAnimationComplete={() => console.log('onAnimationComplete')}
  padding={8}
  rotation={0}
  backgroundWidth={12}
  backgroundColor="#fff" >
    {
      (fill)=>(
        <Text style={{fontFamily:'Fredoka-Regular',fontSize:16, color:'#fff'}}>{fill || 0}</Text>
      )
    }
    </AnimatedCircularProgress>
    <AntDesign name="arrow-up" size={24} color="#fff"/>
    </View>
    <Text style={{fontSize:16, fontFamily:'Fredoka-Regular', color:'white'}}>
      Stress Score
    </Text>
    </View>
    </ScrollView>

          </View>
          <View style={{marginTop:28}}>
               <Text
              style={{
                fontFamily: "Fredoka-Medium",
                fontSize: 24,
                color: Colors.primary,
              }}
            >
              Daily Rewards
            </Text>
            <View style={{marginTop:16}}>
              <RewardTrackerCard />
            </View>
          </View>
          <View style={{marginTop:28, marginBottom:28}}>
             <Text
              style={{
                fontFamily: "Fredoka-Medium",
                fontSize: 24,
                color: Colors.primary,
              }}
            >
              Mood Coach
            </Text>
            <View style={{marginTop:16}}>
              <MoodCoach />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FBE7E5",
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  headerStyle: {
    justifyContent: "space-between",
    backgroundColor: "#FBE7E5",
    alignItems: "center",
    alignContent: "center",
  },
  headingTitle: {
    fontFamily: "Fredoka-Bold",
    fontSize: 28,
    color: Colors.primary,
  },
  subTitle: {
    fontFamily: "Fredoka-Regular",
    fontSize: 20,
    color: Colors.secondary,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  badgeStyle: {
    width: 64,
    height: 28,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
  miniProgressCalender: {
    marginTop: 24,
    backgroundColor: "#5E4C4B",
    borderRadius: 20,
    padding: 12,
  },
  dateStyle: {
    minWidth: 20,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  activeDate: {
    backgroundColor: "black",
    color: "#fff",
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
  metricCard: {
    padding: 16,
    borderRadius: 12,
    position: "relative",
    flex: 1,
    height: "100%",
    justifyContent:'flex-start',
    alignItems:'flex-start',
    alignContent:'flex-start'
  },
});
