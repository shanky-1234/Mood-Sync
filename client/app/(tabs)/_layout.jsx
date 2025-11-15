import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs, useRouter } from "expo-router";
import { Modal, StyleSheet, TouchableOpacity, View,Animated,Easing } from "react-native";
import { Colors } from '../Constants/styleVariable';
import { useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { overlay } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';



const Layout = () => {
  const router = useRouter()
  const [menuOpen,setMenuOpen] = useState(false)
  const rotation = useState(new Animated.Value(0))[0];
  const overlayOpacity = useState(new Animated.Value(0)).current;
  const optionOpacity = useState(new Animated.Value(0))[0];
  const optionTranslate = useState(new Animated.Value(20))[0]
  
  const toggleMenu = () =>{
    if(menuOpen){
       Animated.parallel([
        Animated.timing(rotation, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(optionOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(optionTranslate, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(optionOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(optionTranslate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    }
    const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'], // + → ×
  });
  return (
    <>
    
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.21,
          shadowRadius: 7.68,
          elevation: 12,
          position:'relative',
          bottom:0,
          height:90,
          paddingTop:12
        },
        tabBarInactiveTintColor:'#6d6d6dff',
        tabBarActiveTintColor:Colors.primary
      }}
      
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false, tabBarIcon:({color,focused,size})=>{
           return( focused ?
            <View style={{position:'relative'}}>
      

            
            <Octicons name="home-fill" size={size} color={color} />
            </View>:
            <Octicons name="home" size={size} color={color} />
          )}}}
      />
      <Tabs.Screen
        name="MyJournals"
        options={{ title: "My Journals", headerShown: true , headerStyle:{backgroundColor:'#FBE7E5',elevation:0}, headerTitleStyle:{fontFamily:'Fredoka-Bold', fontSize:28, color:Colors.primary},headerRight:()=>{
          return (
           <Ionicons name="add" size={32} color={Colors.primary} style={{paddingRight:28}} onPress={()=>router.replace('addJournal')} />

          )
        },tabBarIcon:({color,size,focused})=>{
          return( focused ? 
            
            <FontAwesome5 name="book-open" size={size} color={color}/>:
            <Feather name="book" size={size} color={color} />
            
          )
        }}}
      />
      <Tabs.Screen
        name="Add"
        options={{ title: "Add", headerShown: false,tabBarIcon:({color,size,focused})=>null }}//hiding the button
      />
      <Tabs.Screen
        name="Stats"
        options={{ title: "Mood Chart", headerShown: false,tabBarIcon:({color,size,focused})=>{
          return( focused ? 
            
            <Ionicons name="stats-chart" size={size} color={color} />:
            <Ionicons name="stats-chart-outline" size={size} color={color} />
            
          )
        }  }}
      />
      <Tabs.Screen
        name="Calender"
        options={{ title: "Mood Calender", headerShown: false,tabBarIcon:({color,size,focused})=>{
          return( focused ? 
            
            <Ionicons name="calendar-sharp" size={size} color={color} />:
            <Ionicons name="calendar-outline" size={size} color={color} />
            
          )
        } }}
      />
    </Tabs>
    {/* Overlay*/}
            {
              menuOpen && (
                <Animated.View 
                pointerEvents={menuOpen ? 'auto' : 'none'}
                style={[StyleSheet.absoluteFillObject,{flex:1,backgroundColor:'rgba(0,0,0,0.5)',opacity:overlayOpacity,zIndex: 99}]}
                
                >
                  <TouchableOpacity
                     style={{ flex: 1 }}
                      activeOpacity={1}
                      onPress={toggleMenu}/>
                </Animated.View>
              )
            }
        {/* Floating Options */}
        {menuOpen && (
          <Animated.View
            style={[
              styles.optionContainer,
              {
                opacity: optionOpacity,
                transform: [{ translateY: optionTranslate }],
                zIndex:100
              },
            ]}
          >
            <View style={styles.buttonPosition}>
              <View style={styles.floatingRow}>
        <TouchableOpacity style={styles.floatingOption} onPress={()=>router.replace('/(checkin)/firstStep')}>
          <MaterialIcons name="emoji-emotions" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingOption}>
          <Ionicons name="journal-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
            </View>
          </Animated.View>
        )}
        {/*Add button */}
       <TouchableOpacity style={styles.addButton} onPress={toggleMenu}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate, }] }}>
            <Fontisto name="plus-a" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      
    
    </>
  );
};

export default Layout;

const styles = StyleSheet.create({
  addButton:{
    width:60,
    height:60,
    backgroundColor:Colors.primary,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    borderRadius:100,
    position:'absolute',
    bottom:30,
    zIndex:101
  },
  backgroundOverlay:{
    flex:1,
    backgroundColor:'black',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position:'relative',
    zIndex:2
  },
  buttonPosition:{
    position:'absolute', bottom:40, justifyContent:'center',alignSelf:'center',zIndex:3
  },
  floatingOption:{
    width:60,
    height:60,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    borderRadius:100,
  },
  optionContainer: {
  position: 'absolute',
  bottom: 80,
  alignSelf: 'center',
},
floatingRow: {
  flexDirection: 'row',
  gap: 50,
},

});
