import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Link } from 'expo-router'
import React, { useRef } from 'react'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import { Button } from 'react-native-paper'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Swipeable} from 'react-native-gesture-handler'
import Feather from '@expo/vector-icons/Feather';

const MyJournals = () => {
  const data=[{id:1,title:'Title',description:'This is the descriptions'},
    {id:2,title:'Title2',description:'This is the descriptions2'},
    {id:3,title:'Title2',description:'This is the descriptions2'},
    {id:4,title:'Title2',description:'This is the descriptions2'},
    {id:5,title:'Title2',description:'This is the descriptions2'},
    {id:6,title:'Title2',description:'This is the descriptions2'},
  ]
  const swipeRef = useRef({})
  const renderRight = ()=>{
    return(
      <View style={{flexDirection:'row',gap:20,marginLeft:40,justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity style={{backgroundColor:Colors.secondary,padding:16, borderRadius:100}}>
          <Feather name="edit-2" size={24} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={{borderColor:Colors.primary,padding:16, borderWidth:2, borderRadius:100,}}>
          <MaterialIcons name="delete-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={[{backgroundColor:'#FBE7E5',flex:1}]}>
      <View style={[styles.journalPaper]}>
        <Image source={require('../../assets/icons/noteRing.png')} style={{alignSelf:'center',position:'absolute',top:-10}}/>
          <ScrollView style={[globalStyle.container,{flex:1}]}>
              <View>
                {
                  data.map((item)=>{
                      return(
                        <Swipeable
                        key={item.id}
                        renderRightActions={renderRight}
              >
              <View style={styles.note} >
                <View>
                <Image source={require('../../assets/icons/clips/red.png')} style={{position:'absolute',top:-25,right:10,zIndex:1}}/>
                </View>
                <View>
                <Text style={{fontFamily:'Fredoka-Medium',color:'white',fontSize:16}}>{item.title}</Text>
                <Text style={{fontFamily:'JosefinSlab-SemiBold', color:'white', fontSize:14, marginTop:8}}>{item.description}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
                  <Button style={styles.button}><Text style={{fontFamily:'Fredoka-Medium',color:Colors.primary,gap:12}}>Analysis<MaterialCommunityIcons name="star-four-points" size={16} color={Colors.primary} /></Text></Button>
                  <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                  <AntDesign name="clock-circle" size={16} color="white" />
                  <Text style={{fontFamily:'Fredoka-Regular',color:'white',fontSize:12}}>12:00</Text>
                  </View>
                </View>
              </View>
              </Swipeable>
                      )
                  })
                }
              
             </View>
             
          </ScrollView>
      </View>
    </View>
  )
}

export default MyJournals

const styles = StyleSheet.create({
  journalPaper:{
    backgroundColor:'white',flex:1,marginTop:28,borderTopColor:'#B7B2B2',borderTopWidth:2,position:'relative',paddingTop:24, 
  },
  note:{padding:16, backgroundColor:Colors.primary, borderRadius:12,position:'relative',zIndex:0,marginBottom:16,overflow:'hidden'},
  button:{
    width:'70%',
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
    
  }
})