import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import  { useRef } from 'react'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import { Button, Dialog } from 'react-native-paper'
import { Modal, PaperProvider, Portal } from 'react-native-paper'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Swipeable} from 'react-native-gesture-handler'

import { useCallback } from 'react'
import jounralService from '../Service/journal'
import { useState } from 'react'
import Notes from '../components/Notes'

const MyJournals = () => {
  const [journals,setJournals] = useState([])
  const [journalId,setJournalId] = useState('')
  const swipeRef = useRef({})
  const [visible,setVisible]=useState(false)
useFocusEffect(
  useCallback(()=>{
    getAllJournal()
  },[])
)


const askDelete = (id) =>{
  setVisible(true)
  setJournalId(id)
}

const handleDelete = async(id)=>{
  console.log(id)
  try {
    const response = await jounralService.deleteJournal(id)
    if(response.success){
      console.log(response)
      setVisible(false)
      getAllJournal() //  re fetch after deletion
    }
  } catch (error) {
    console.error(error)
  }
}


  const getAllJournal = async()=>{
    try {
      const response = await jounralService.getJournalofUser()
      if(response.success){
        console.log(response)
        setJournals(response.journals)
      }
    } catch (error) {
        console.error(error)
    }
  }

  const renderRight = (id)=>{
    return(
      <View style={{flexDirection:'row',marginLeft:20,justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity style={{borderColor:Colors.primary,padding:16, borderWidth:2, borderRadius:100,}} onPress={()=>askDelete(id)}>
          <MaterialIcons name="delete-outline" size={24} color={Colors.primary}  />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <PaperProvider>
    <View style={[{backgroundColor:'#FBE7E5',flex:1}]}>
      <View style={[styles.journalPaper]}>
        <Image source={require('../../assets/icons/noteRing.png')} style={{alignSelf:'center',position:'absolute',top:-10}}/>
          <ScrollView style={[globalStyle.container,{flex:1}]}>
              <View>
                {
                  journals.map((item)=>{
                      return(
                        <Swipeable
                        key={item._id}
                        renderRightActions={()=>renderRight(item._id)}
              >
             <Notes title={item.title} id={item._id} color={item.color} content={item?.content} createdAt={item.updatedAt} />
              </Swipeable>
                      )
                  })
                }
              
             </View>
             
          </ScrollView>
      </View>
       <View>
                      <Portal>
                          <Dialog visible={visible} onDismiss={()=>setVisible(false)} >
                             <Image
                source={require("../../assets/mascot/dialouge.png")}
                resizeMode="contain"
                style={{
                  width: 100,
                  height: 100,
                  justifyContent: "center",
                  alignSelf: "center",
                  alignContent: "center",
                }}
              />
                              <Dialog.Title style={{fontFamily:'Fredoka-Medium',fontSize:20,textAlign:'center',color:Colors.primary}}>Do you wanna delete your Journal ?</Dialog.Title>
                              <Dialog.Actions style={{alignContent:'center',alignSelf:'center'}}>
                                <Button style={[{backgroundColor:Colors.primary},styles.button]} onPress={()=>handleDelete(journalId)}><Text style={{fontFamily:'Fredoka-Regular',color:'#fff'}}>Delete</Text></Button>
                                <Button style={styles.button} ><Text  style={{fontFamily:'Fredoka-Regular',color:Colors.primary}} onPress={()=>setVisible(false)}>Cancel</Text></Button>
                              </Dialog.Actions>
                          </Dialog>
                      </Portal>
                    </View>
    </View>
    </PaperProvider>
  )
}

export default MyJournals

const styles = StyleSheet.create({
  journalPaper:{
    backgroundColor:'white',flex:1,marginTop:28,borderTopColor:'#B7B2B2',borderTopWidth:2,position:'relative',paddingTop:24, 
  },
  note:{padding:16, borderRadius:12,position:'relative',zIndex:0,marginBottom:16,overflow:'hidden'},
   button:{
    width:'30%',
    marginTop: 24,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
    color:'#fff'
  }
  
})