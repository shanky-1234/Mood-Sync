import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StepProgress from '../components/StepProgress'
import { globalStyle } from '../Constants/globalStyles'
import { Button, TextInput } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { Colors } from '../Constants/styleVariable'
import { useCheckIn } from '../Context/CheckinContext'
import { useState } from 'react'
import checkInService, { registerCheckIn } from '../Service/checkin'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/authSlice'
import { useStoredCheckIn } from '../Context/StoredCheckIn'

const fifthStep = () => {
  const [note,setNote] = useState(null)
  const currentStep=4
  const {isLoading} = useSelector(state=>state.auth)
  const dispatchs = useDispatch()
  const router = useRouter()
  const {setCheckInResult} = useStoredCheckIn()
  const handleLinking = () =>{
    router.back()
  }
  const {state,dispatch} = useCheckIn()
  console.log(state)
  const handleText =(value)=>{
    setNote(value)
    dispatch({type:'UPDATE_STEP5_NOTES',payload:value})
  }

  const handleSubmit = async()=>{
    dispatch(setLoading(true))
    try {
         const payload = {
      moodSlider: state.moodScore,
      energySlider: state.energyScore,
      causes: state.causes,
      causesCustom: state.causesCustom,
      emotion: state.emotions,
      emotionCustom: state.emotionCustom,
      notes: state.notes
    }
      const respone = await checkInService.registerCheckIn(payload)
      if(respone.success === true){
        console.log(respone)
        setCheckInResult(respone)
        router.replace('../completeAnalysis/analysisComplete')
      }
      console.log('not working')
    } catch (error) {
      console.error(error)
    }
    finally{
      dispatch(setLoading(false))
    }
  }
  return (
<View style={[globalStyle.container,{backgroundColor:'#FCE9E7',flex:1,}]}>
  <View style={{marginTop: 28 }}>
        <StepProgress currentStep={currentStep} progressLink={handleLinking} />
      </View>
      <Text style={{fontFamily:'Fredoka-Medium',fontSize:28, textAlign:'center',marginTop:28, color:Colors.primary}}>Extra Notes (Optional)</Text>
      <View style={{marginTop:28}}>
        <TextInput multiline={true} mode='outlined' value={note} placeholder='Write Here' placeholderTextColor={Colors.primary} onChangeText={(note)=>handleText(note)}
        contentStyle={{backgroundColor:'#FFD2D1',fontFamily:'Fredoka-Regular',paddingHorizontal:12,textAlignVertical:'top',padding:24,minHeight:200,paddingTop:12,borderRadius:8}}  outlineColor="transparent" style={{color:Colors.primary}} textAlignVertical='top' />
      </View>
       <Button mode="contained" style={styles.button} onPress={handleSubmit}><Text
                        style={{
                          fontFamily: "Fredoka-Regular",
                          fontSize: 16,
                          textAlign: "center",
                          color: "#fff",
                          marginRight: 8,
                        }}
                      >
                        Submit
                      </Text></Button>
    </View>
  )
}

export default fifthStep

const styles = StyleSheet.create({
  button: {
      marginTop: 24,
      backgroundColor:Colors.primary,
      borderRadius: 8,
      height: 56,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
})