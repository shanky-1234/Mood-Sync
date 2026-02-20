import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";
import { Colors } from "../Constants/styleVariable";
import { globalStyle } from "../Constants/globalStyles";
import { Button, TextInput, Portal,Dialog, PaperProvider, HelperText} from "react-native-paper";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import authService from "../Service/auth";
import {useDispatch, useSelector} from 'react-redux'
import { setIsGoogleAccount, setLoading, setToken, setUser } from "../redux/slices/authSlice";

import { OtpInput } from "react-native-otp-entry";
import { useEffect } from "react";

const EmailVerificationPassword = () => {
 const [visible, setVisible] = useState(false)
 const [codes,setCodes] = useState('')
 const [dialougeTitle,setDialougeTitle] = useState('');
 const [dialougeContent,setDialougeContent] = useState('');
  const {isLoading} = useSelector((state)=>state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const {email} = useLocalSearchParams()
  useEffect(()=>{
    console.log(email)
  },[])
  const verifyCode = async () =>{
    try{
      dispatch(setLoading(true))
      const respone = await authService.verifyPasswordRequestCode(email,codes)
    if(respone){
      
      setVisible(true)
      setDialougeTitle('Email Verified Successfully')
      router.replace({
        pathname:'./ChangePassword/',
      params:{token:respone.resetToken}})
    }
    }
    catch(error){
      console.log(error)
    }finally{
      dispatch(setLoading(false))
    }
    
  } 
  return (
    <PaperProvider>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container]}>
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Image
            source={require("../../assets/logos/MoodSync.png")}
            style={{ width: 200, height: 50 }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Email Verification</Text>

        <View style={[styles.loginContainer, globalStyle.container]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: "80%" }}
            style={{ flex: 1 }}
          >
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../../assets/mascot/mailsend.png')} style={{width:250,height:100}} resizeMode="contain"/>
                <Text style={{marginTop:12,marginBottom:12, fontFamily:'Fredoka-Regular'}}>There is a code sent to your email</Text>
            </View>
           <OtpInput 
           numberOfDigits={5} 
           onTextChange={(text) => setCodes(text)} 
           focusColor={Colors.primary}
           placeholder="******"
           type="numeric"
           theme={{
             pinCodeTextStyle: styles.pinCodeText
           }}/>
            <View>
              <Button
                mode="contained"
                style={[styles.button,isLoading && {opacity:0.8}]}
                labelStyle={{ fontFamily: "Fredoka-Regular" }}
                onPress={()=>verifyCode()}
                disabled={isLoading}
              >
                <View style={{flexDirection:'row',gap:4}}>
                {
                  isLoading && <ActivityIndicator color='#FFF' />
                }
                <Text style={{fontFamily: "Fredoka-Regular",color:'#fff'}}> {isLoading ? "Verifying" : "Verify"}</Text>
                </View>
                
              </Button>
              
          
              </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                marginTop: 60,
              }}
            >
              <Text style={{ fontFamily: "Fredoka-Regular" }}>
                Didn't Recive Any Mail ?
              </Text>
              <Link
                style={{
                  color: Colors.primary,
                  marginTop: 8,
                  fontFamily: "Fredoka-Regular",
                }}
                href={"./Login/"}
              >
                Send Again
              </Link>
            </View>
          </ScrollView>
       
        </View>
              {/* Dialog Container*/}
                                   
                                     <View>
                  <Portal>
      <Dialog visible={visible} onDismiss={()=>setVisible(false)}>
        <Image source={require('../../assets/mascot/dialouge.png')} resizeMode="contain" style={{width:100,height:100,justifyContent:'center',alignSelf:'center',alignContent:'center'}}/>
        <Dialog.Title style={{fontFamily:'Fredoka-Semibold', color:Colors.primary, textAlign:'center'}}>{dialougeTitle && dialougeTitle}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{fontFamily:'Fredoka-Regular', color:'black', textAlign:'center'}}>{dialougeContent && dialougeContent}</Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
    </View>
    
      </View>
    </KeyboardAvoidingView>
    </PaperProvider>
  );
};

export default EmailVerificationPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontFamily: "Fredoka-Medium",
    color: "#fff",
    marginTop: 40,
  },
  loginContainer: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    marginTop: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  button: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonOutlined: {
    borderColor: "#DEDEDE",
    borderRadius: 8,
    height: 56,
    marginTop: 20,
  },
  errorText:{
    fontFamily:'Fredoka-Regular',
    fontSize:12,
    color:'#FF6B6B', marginTop: 4, marginLeft: 4
  },
  pinCodeText:{
    fontFamily:'Fredoka-Regular'
  }
});
