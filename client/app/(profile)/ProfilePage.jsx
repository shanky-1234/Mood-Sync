import { StyleSheet, Text, View,Image, TouchableOpacity,} from 'react-native'
import {React,useCallback, useEffect, useState,} from 'react'
import { useFocusEffect } from 'expo-router'
import { Button,Badge,Switch } from 'react-native-paper'
import axios from 'axios'
import authService from '../Service/auth'
import { useDispatch,useSelector } from 'react-redux'
import { setIsGoogleAccount, setToken, setUser } from '../redux/slices/authSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, useRouter } from 'expo-router'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { fetchAndUpdateUser } from '../utils/fetchandupdatedata'
import { getMoodState } from '../utils/getMoodState'
import { setAudio } from '../redux/slices/audioSlice'
import GoogleSign from '../authPages/GoogleSign'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const ProfilePage = () => {
const dispatch = useDispatch()
const [switches,  setSwitches] = useState(true)
const router = useRouter()
const [loggedInfo,setLoggedInfo] = useState()
 
const {isSound} = useSelector((state)=>state.audio)
  const{userInfo,isGoogleAccount} = useSelector((state)=>state.auth)
  const {checkInInfo} = useSelector((state)=>state.checkIn) // Get from slices and states

  const toggleSwitch = ()=>{
    setSwitches(prev=>!prev)
    dispatch(setAudio(switches))
    
  }



const handleLogout = async()=>{
 try {
    if(isGoogleAccount){
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
       AsyncStorage.removeItem('UserData')
      AsyncStorage.removeItem('UserToken')
      AsyncStorage.removeItem('isGoogle')
        dispatch(setUser(null))
      dispatch(setToken(''))
      dispatch(setIsGoogleAccount(false))
    }
    const response = await authService.logout()
    if(response){
      dispatch(setUser(null))
      dispatch(setToken(''))
      AsyncStorage.removeItem('UserData')
      AsyncStorage.removeItem('UserToken')
      router.replace('/authPages/OnboardingAuth')
      return null
    }
 } catch (error) {
  console.error(error)
 }
}


  const moodState = getMoodState(userInfo?.lastMoodScore,userInfo?.lastEnergyScore)

useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const updateUser = async () => {
      const user = await fetchAndUpdateUser(dispatch);

      if (!user && isActive) {
        router.replace("/authPages/Login");
      } else if (user && isActive) {
        setLoggedInfo(user);
      }
    };

    updateUser();

    return () => {
      isActive = false;
    };
  }, [])
);

  return (
    <View style={[globalStyle.container,{backgroundColor:'#FBE7E5', flex:1}]}>
      <View style={{marginTop:24}}>
       <Image
                         source={moodState.image}
                         resizeMode="contain"
                         style={{ justifyContent: "center", alignSelf: "center" }}
                         width={200}
                         height={200}
                       />
      </View>
      <View style={{flex:1, height:200}}>
        <Text style={{fontFamily:'Fredoka-Medium', fontSize:24, color:Colors.primary, textAlign:'center'}}>{userInfo?.fullname}</Text>
        <Text style={{fontFamily:'JosefinSlab-Bold', fontSize:16, color:Colors.primary, textAlign:'center'}}>{userInfo?.gender
  ? userInfo.gender.charAt(0).toUpperCase() + userInfo.gender.slice(1)
  : ''}</Text>
        <Text style={{fontFamily:'JosefinSlab-Bold', fontSize:16, color:Colors.primary, textAlign:'center'}}>{userInfo?.email}</Text>
        <View style={{gap:12,marginTop:16,flexDirection:'row', justifyContent:'space-between'}}>
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
                              {userInfo?.totalCheckIns|| "0"}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: "Fredoka-Regular",
                                color: "#fff",
                              }}
                            >
                              Total Check Ins
                            </Text>
                          </View>
                  
                        </View>
                           <View
                          style={[style.metricCard, { backgroundColor: Colors.secondary }]}
                        >
                          <View style={{ zIndex: 1 }}>
                            <Text
                              style={{
                                fontSize: 24,
                                fontFamily: "Fredoka-Bold",
                                color: "#fff",
                              }}
                            >
                              {userInfo?.totalJournals || "0"}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: "Fredoka-Regular",
                                color: "#fff",
                              }}
                            >
                              Total Journal 
                            </Text>
                          </View>
                        </View>
        </View>
        <View style={{flexDirection:'row', alignItems:'center',alignContent:'center',alignSelf:'center',gap:12}}>
          <Text style={{fontFamily:'Fredoka-Regular', fontSize:16, textAlign:'center', marginTop:'16'}}>Highest Streak</Text>
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
                              {userInfo?.streaks.longest}
                            </Text>
                          </View>
                        </Badge>
        </View>
        <View style={{marginTop:24,gap:8}}>
          <View style={[style.card, {alignContent:'center',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
         <View style={{flexDirection:'row', gap:8}}>
          <MaterialIcons name="audiotrack" size={16} color={Colors.primary} />
          <Text style={[style.cardText]}>Audio</Text>
          </View>
          <Switch value={isSound} color={Colors.primary} onValueChange={toggleSwitch}/>
          </View>
          <View style={[style.card, {alignContent:'center',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
            <View style={{flexDirection:'row', gap:8}}>
            <Fontisto name="bell-alt" size={16} color={Colors.primary} />
          <Text style={[style.cardText]}>Notification</Text>
          <Link href={'../completeAnalysis/Analysis'}>Analysis</Link>
          <Link href={'../completeAnalysis/analysisComplete'}>Analysis</Link>
          </View>
          <Switch color={Colors.primary}/>
          </View>
        </View>
        <View style={{marginTop:24}}>
          { !isGoogleAccount &&
          <TouchableOpacity style={style.card}>
      <View style={{flexDirection:"row", alignItems:'center',width:'100%', gap:12,}}>
    
     <Text style={style.cardText}><Text>Update Password</Text></Text>
    
    </View>
     
    </TouchableOpacity>
}
    <View style={{marginTop:4,marginBottom:16}}>
     <Button
                    mode="contained"
                    style={[style.button]}
                    labelStyle={{ fontFamily: "Fredoka-Regular" }}
                    onPress={()=>handleLogout()}
                  >  
                      <Text
                        style={{ fontFamily: "Fredoka-Regular", color: "#fff" }}
                      >
                        Log Out
                      </Text> 
                  </Button>
        </View>
        </View>
      </View>
    </View>
  )
}

export default ProfilePage

const style = StyleSheet.create({
    metricCard: {
    padding: 16,
    borderRadius: 12,
    flex: 1,
    position:'relative',
    width:200,
    height: 'auto',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    alignContent:'flex-start'
  },
  badgeStyle: {
    width: 64,
    height: 28,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
    card:{
    backgroundColor:'#fff',
    borderRadius:16,
    borderWidth:1,
    borderColor:'#E1E1E1',
    padding:20
  },
  cardText:{
    fontFamily:'Fredoka-Regular',
    fontSize:16,
    color:Colors.primary
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
})