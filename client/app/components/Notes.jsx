import { StyleSheet, Text, View, TouchableOpacity,Image } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useState } from 'react'
import { Colors } from '../Constants/styleVariable'
import { useRouter } from 'expo-router'


const Notes = ({title,content,createdAt,color,id}) => {

const [visible,setVisible]=useState(false)


    const router = useRouter()
    const getDateandTime =(dateString) =>{
  const d = new Date(dateString)

  const weekDay = d.toLocaleString("en-US",{weekday:"short"})
  const day = d.getDate();
  const month = d.toLocaleString("en-US",{month:"short"})
  const year = d.getFullYear();

  let hours = d.getHours();
  let minutes = d.getMinutes().toString().padStart(2, "0");

  // convert to 12-hour format
  const ampm = hours >= 12 ? "" : "";
  hours = hours % 12 || 12;

  return `${weekDay} ${day} ${month}, ${year} ${hours}:${minutes} ${ampm}`;
}

const handleJournals = (id) =>{
  router.push({
    pathname:'journalPage',
    params:{
      journalId:id
    }
  })
}
  return (
    
   <TouchableOpacity style={[styles.note,{backgroundColor:color}]} onPress={()=>handleJournals(id)}>
                <View>
                <Image source={color === '#DE4742' ? require('../../assets/icons/clips/red.png') : color === '#00A8DE' ? require('../../assets/icons/clips/blue.png') : color === '#9B5DE5' ? require('../../assets/icons/clips/purple.png') : require('../../assets/icons/clips/red.png')} style={{position:'absolute',top:-25,right:10,zIndex:1}}/>
                </View>
                <View>
                <Text style={{fontFamily:'Fredoka-Medium',color:'white',fontSize:16}}>{title}</Text>
                <Text style={{fontFamily:'JosefinSlab-SemiBold', color:'white', fontSize:14, marginTop:8,marginBottom:8}} numberOfLines={2}>{content}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                  <AntDesign name="clock-circle" size={16} color="white" />
                  <Text style={{fontFamily:'Fredoka-Regular',color:'white',fontSize:12}}>{getDateandTime(createdAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
             
              
  )
}

export default Notes

const styles = StyleSheet.create({ note:{padding:16, borderRadius:12,position:'relative',zIndex:0,marginBottom:16,overflow:'hidden'},})