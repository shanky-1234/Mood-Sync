import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StepProgress from '../components/StepProgress'
import { globalStyle } from '../Constants/globalStyles'
import { Button, TextInput } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { Colors } from '../Constants/styleVariable'

const fifthStep = () => {
  const currentStep=4
  const router = useRouter()
  const handleLinking = () =>{
    router.back()
  }
  return (
<View style={[globalStyle.container,{backgroundColor:'#FCE9E7',flex:1,}]}>
  <View style={{marginTop: 28 }}>
        <StepProgress currentStep={currentStep} progressLink={handleLinking} />
      </View>
      <Text style={{fontFamily:'Fredoka-Medium',fontSize:28, textAlign:'center',marginTop:28, color:Colors.primary}}>Extra Notes (Optional)</Text>
      <View style={{marginTop:28}}>
        <TextInput multiline={true} mode='outlined' placeholder='Write Here' placeholderTextColor={Colors.primary}
        contentStyle={{backgroundColor:'#FFD2D1',fontFamily:'Fredoka-Regular',paddingHorizontal:12,textAlignVertical:'top',padding:24,minHeight:200,paddingTop:12,borderRadius:8}}  outlineColor="transparent" style={{color:Colors.primary}} textAlignVertical='top' />
      </View>
       <Button mode="contained" style={styles.button} onPress={()=>router.push('./secondStep')}><Text
                        style={{
                          fontFamily: "Fredoka-Regular",
                          fontSize: 16,
                          textAlign: "center",
                          color: "#fff",
                          marginRight: 8,
                        }}
                      >
                        Continue
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