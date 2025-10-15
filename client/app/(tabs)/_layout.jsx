import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
<<<<<<< HEAD
import { Tabs, useRouter } from "expo-router";
import { Modal, StyleSheet, TouchableOpacity, View,Animated,Easing } from "react-native";
import { Colors } from '../Constants/styleVariable';
import { useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { overlay } from 'react-native-paper';


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
    
=======
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Colors } from '../Constants/styleVariable';

const Layout = () => {
  return (
>>>>>>> origin/main
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
        options={{ title: "My Journals", headerShown: false ,tabBarIcon:({color,size,focused})=>{
          return( focused ? 
            
            <FontAwesome5 name="book-open" size={size} color={color}/>:
            <Feather name="book" size={size} color={color} />
            
          )
        }}}
      />
      <Tabs.Screen
        name="Add"
<<<<<<< HEAD
        options={{ title: "Add", headerShown: false,tabBarIcon:({color,size,focused})=>null }}//hiding the button
=======
        options={{ title: "Add", headerShown: false,tabBarIcon:({color,size,focused})=>{
          return( 
            <View style={[styles.addButton,  {transform:[{scale: focused ? 1.1:1}]} ]}>
           <Fontisto name="plus-a" size={size} color='white' />
           </View>
            
          )
        } }}
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
>>>>>>> origin/main
  );
};

export default Layout;

const styles = StyleSheet.create({
  addButton:{
<<<<<<< HEAD
    width:70,
    height:70,
=======
    width:60,
    height:60,
>>>>>>> origin/main
    backgroundColor:Colors.primary,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    borderRadius:100,
    position:'absolute',
<<<<<<< HEAD
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

=======
    bottom:1,

  }
>>>>>>> origin/main
});
