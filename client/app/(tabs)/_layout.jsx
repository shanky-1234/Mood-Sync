import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Colors } from '../Constants/styleVariable';

const Layout = () => {
  return (
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
        options={{ title: "Add", headerShown: false,tabBarIcon:({color,size,focused})=>{
          return( 
            <View style={[styles.addButton,  {transform:[{scale: focused ? 1.1:1}]} ]}>
           <Fontisto name="plus-a" size={size} color='white' />
           </View>
            
          )
        } }}
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
    bottom:1,

  }
});
