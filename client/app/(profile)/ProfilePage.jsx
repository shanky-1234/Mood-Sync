import { StyleSheet, Text, View,Image, TouchableOpacity, ScrollView,} from 'react-native'
import {React,useCallback, useEffect, useState,} from 'react'
import { useFocusEffect } from 'expo-router'
import { Button,Badge,Switch, PaperProvider, Portal, Modal, Dialog } from 'react-native-paper'
import axios from 'axios'
import authService from '../Service/auth'
import { useDispatch,useSelector } from 'react-redux'
import { setIsGoogleAccount, setToken, setUser } from '../redux/slices/authSlice'
import {setBackground} from '../redux/slices/backgroundSlice'
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
import { background } from '../utils/backgroundSelector'
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from '@expo/vector-icons/AntDesign'
import { setupUserLocalReminders } from "../Service/reminderService"


const ProfilePage = () => {
const dispatch = useDispatch()
const [switches,  setSwitches] = useState(true)
const [visible,setVisible] = useState(false)
const router = useRouter()
const [loggedInfo,setLoggedInfo] = useState()
const [activeBg,setActiveBg] = useState('background1')
const [hour,setHour] = useState('1')
const [minute,setMinute] = useState('0')
const [hourTwo,setHourTwo] = useState('1')
const [minuteTwo,setMinuteTwo] = useState('0')
const [openHour,setOpenHour] = useState(false)
const [openMinute,setOpenMinute] = useState(false)
const [openHourTwo,setOpenHourTwo] = useState(false)
const [openMinuteTwo,setOpenMinuteTwo] = useState(false)
 
const {isSound} = useSelector((state)=>state.audio)
  const{userInfo,isGoogleAccount} = useSelector((state)=>state.auth)
  const {backgrounds} = useSelector((state)=>state.backgrounds)
  const {checkInInfo} = useSelector((state)=>state.checkIn) // Get from slices and states

const loadReminderSettings = async () => {
  try {
    if (!userInfo?._id) return;

    const stored = await AsyncStorage.getItem(`NotificationReminder_${userInfo._id}`);
    if (!stored) return;

    const parsed = JSON.parse(stored);

    setHour(String(parsed?.journal?.hour ?? '1'));
    setMinute(String(parsed?.journal?.minute ?? '0'));
    setHourTwo(String(parsed?.checkin?.hour ?? '1'));
    setMinuteTwo(String(parsed?.checkin?.minute ?? '0'));
  } catch (error) {
    console.log("Failed to load reminder settings:", error);
  }
};

useEffect(()=>{
  if(userInfo._id){
    loadReminderSettings()
  }
},[userInfo?._id])
  const toggleSwitch = ()=>{
    setSwitches(prev=>!prev)
    dispatch(setAudio(switches))
    
  }


  // Generate hours (0-23)
  const hourData = Array.from({ length: 24 }, (_, i) => ({
    label: String(i).padStart(2, '0'),
    value: String(i)
  }));

  // Generate minutes (0-59)
  const minuteData = Array.from({ length: 60 }, (_, i) => ({
    label: String(i).padStart(2, '0'),
    value: String(i)
  }));


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

const handleLocalNotification = async() =>{
  try {
    if(!userInfo._id) return

     const settings = {
      journal: {
        hour: Number(hour),
        minute: Number(minute),
        enabled: true,
      },
      checkin: {
        hour: Number(hourTwo),
        minute: Number(minuteTwo),
        enabled: true,
      },
    };

    await AsyncStorage.setItem(`NotificationReminder_${userInfo._id}`,JSON.stringify(settings))
    await setupUserLocalReminders(settings, userInfo._id);
    setVisible(false)
    console.log('New Noification Schedule Saved')
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

useEffect(()=>{
  setActiveBg(backgrounds)
},[])

const handleBackground =async(name)=>{
  setActiveBg(name)
  dispatch(setBackground(name))
  await AsyncStorage.setItem('backgroundName',name)
}
  return (
    <PaperProvider>
    <ScrollView style={[globalStyle.container,{backgroundColor:'#FBE7E5'}]}>
      <View style={{marginTop:24}}>
       <Image
                         source={moodState.image}
                         resizeMode="contain"
                         style={{ justifyContent: "center", alignSelf: "center" }}
                         width={200}
                         height={200}
                       />
      </View>
      <View>
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
        <View >
          <Text style={{fontFamily:'Fredoka-Medium',fontSize:24,marginTop:20,color:Colors.primary}}>
            Select Background
          </Text>
        <ScrollView style={{width: "100%", gap: 12, marginTop:16, overflow:'visible'}} horizontal={true} contentContainerStyle={{gap:12}} showsHorizontalScrollIndicator={false}>
          {
            background.map((items,key)=>{
              return(
                <TouchableOpacity key={key} style={[{padding:4, borderWidth:1, borderRadius:20, borderColor:Colors.secondary, overflow:'hidden',justifyContent:'center',alignItems:'center'},items.name === activeBg && { backgroundColor:'#fecece', borderWidth:5 }]} disabled={items.unlock > userInfo?.currentLvl} onPress={()=>handleBackground(items.name)}>
              <View style={{position:'relative'}}>
                <Image source={items.image} style={[{width:200, height:100},items.unlock < userInfo?.currentLvl && {opacity:0.5}]}resizeMode='contain'/>
                  { items.unlock > userInfo?.currentLvl &&
                  <View style={{position:'absolute',top:40,right:50,justifyContent:'center',alignContent:'center',alignItems:'center'}} >
                <Fontisto name="locked" size={24} color={Colors.primary} />
                <Text style={{textAlign:'center',fontFamily:'JosefinSlab-SemiBold',color:Colors.primary}}>Unlocks at level {items.unlock}</Text>
                </View>
                  }
              </View>
          </TouchableOpacity>
              )
            })
          }
          
        </ScrollView>
        </View>
        <View style={{marginTop:24,gap:8}}>
          <View style={[style.card, {alignContent:'center',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
         <View style={{flexDirection:'row', gap:8}}>
          <MaterialIcons name="audiotrack" size={16} color={Colors.primary} />
          <Text style={[style.cardText]}>Audio</Text>
          </View>
          <Switch value={isSound} color={Colors.primary} onValueChange={toggleSwitch}/>
          </View>
          <TouchableOpacity style={[style.card, {alignContent:'center',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]} onPress={()=>setVisible(true)}>
            <View style={{flexDirection:'row', gap:8}}>
            <Fontisto name="bell-alt" size={16} color={Colors.primary} />
          <Text style={[style.cardText]}>Notification Reminder Setting</Text>
          </View>
          
          </TouchableOpacity>
        </View>
        <View style={{marginTop:24}}>
          { !isGoogleAccount &&
          <TouchableOpacity style={style.card} onPress={()=>router.push('./UpdatePassword')}>
      <View style={{flexDirection:"row", alignItems:'center',width:'100%', gap:12,}}>
    
     <Text style={style.cardText}><Text>Update Password</Text></Text>
    
    </View>
     
    </TouchableOpacity>
}
   
        </View>
      </View>
       <View style={{marginBottom:40}}>
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

    </ScrollView>
    {/* Modal Popup */}
    <Portal>
      <Dialog visible={visible} onDismiss={()=>setVisible(false)} style={{backgroundColor:'white', flex:1, }}>
        <Dialog.Title style={{fontFamily:'Fredoka-Semibold', color:Colors.primary}}>Notification Reminder</Dialog.Title>
        <Dialog.Content>
          <Text style={{fontFamily:'Fredoka-Regular', fontSize:14}}>Set Up Notification Reminder for Journal Checkins</Text>
          <View style={{marginTop:12}}> 
            <Text style={{fontFamily:'Fredoka-Medium', fontSize:18, color:Colors.primary}}>Journal Reminder</Text>
            <View style={{flexDirection:'row', gap:12, alignItems:'center'}}>
              <View style={{flex:1}}>
                <Text style={{fontFamily:'Fredoka-Regular', fontSize:12, marginBottom:4, color:Colors.primary}}>Hour</Text>
                <DropDownPicker
                  open={openHour}
                  value={hour}
                  items={hourData}
                  setOpen={setOpenHour}
                  setValue={setHour}
                  placeholder="HH"
                  zIndex={1000}
                  zIndexInverse={1000}
                  placeholderStyle={{fontFamily:'Fredoka-Regular'}}
                  textStyle={{fontFamily:'Fredoka-Regular'}}
                />
              </View>
              <Text style={{fontFamily:'Fredoka-Semibold', fontSize:20, marginTop:16}}>:</Text>
              <View style={{flex:1}}>
                <Text style={{fontFamily:'Fredoka-Regular', fontSize:12, marginBottom:4, color:Colors.primary}}>Minute</Text>
                <DropDownPicker
                  open={openMinute}
                  value={minute}
                  items={minuteData}
                  setOpen={setOpenMinute}
                  setValue={setMinute}
                  placeholder="MM"
                  zIndex={1000}
                  zIndexInverse={2000}
                  placeholderStyle={{fontFamily:'Fredoka-Regular'}}
                  textStyle={{fontFamily:'Fredoka-Regular'}}
                />
              </View>
          </View>
              <View style={{marginTop:12}}> 
            <Text style={{fontFamily:'Fredoka-Medium', fontSize:18, color:Colors.primary}}>Check-In Reminder</Text>
            <View style={{flexDirection:'row', gap:12, alignItems:'center'}}>
              <View style={{flex:1}}>
                <Text style={{fontFamily:'Fredoka-Regular', fontSize:12, marginBottom:4, color:Colors.primary}}>Hour</Text>
                <DropDownPicker
                  open={openHourTwo}
                  value={hourTwo}
                  items={hourData}
                  setOpen={setOpenHourTwo}
                  setValue={setHourTwo}
                  placeholder="HH"
                  zIndex={999}
                  placeholderStyle={{fontFamily:'Fredoka-Regular'}}
                  textStyle={{fontFamily:'Fredoka-Regular'}}
                />
              </View>
              <Text style={{fontFamily:'Fredoka-Semibold', fontSize:20, marginTop:16}}>:</Text>
              <View style={{flex:1}}>
                <Text style={{fontFamily:'Fredoka-Regular', fontSize:12, marginBottom:4, color:Colors.primary}}>Minute</Text>
                <DropDownPicker
                  open={openMinuteTwo}
                  value={minuteTwo}
                  items={minuteData}
                  setOpen={setOpenMinuteTwo}
                  setValue={setMinuteTwo}
                  placeholder="MM"
                  zIndex={999}
                  placeholderStyle={{fontFamily:'Fredoka-Regular'}}
                  textStyle={{fontFamily:'Fredoka-Regular'}}
                />
              </View>
          </View>
          </View>
            
          </View>
        </Dialog.Content>
        <Dialog.Actions style={{alignContent:'center',alignItems:'center',}}>
          <Button onPress={handleLocalNotification} style={style.button} textColor='white'>Save</Button>
          <Button onPress={()=>setVisible(false)}style={[style.button,{backgroundColor:'white'}]} textColor={Colors.primary}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
    </PaperProvider>

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