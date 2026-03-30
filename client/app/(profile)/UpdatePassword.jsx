import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors } from "../Constants/styleVariable";
import { globalStyle } from "../Constants/globalStyles";
import {
  Button,
  TextInput,
  Dialog,
  Portal,
  PaperProvider,
} from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useRef, useState } from "react";
import authService from "../Service/auth";
import { useDispatch, useSelector } from "react-redux";
import { setIsGoogleAccount, setLoading, setToken, setUser } from "../redux/slices/authSlice";

import { useEffect } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from "@react-native-async-storage/async-storage";



GoogleSignin.configure({
  webClientId:process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
})

const ForgotPassword = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword,setNewPassword] = useState("")
  const [onSecureOne,setOnSecureOne] = useState(true)
  const [onSecureTwo,setOnSecureTwo] = useState(true)
  const [visible, setVisible] = useState(false);
  const [dialougeTitle, setDialougeTitle] = useState("");
  const [dialougeContent, setDialougeContent] = useState("");
  const { isLoading, userToken } = useSelector((state) => state.auth);
  const [userInfo,setUserInfo] = useState([])
  const dispatch = useDispatch();
  
 
 
  const handleUpdatePassword = async () => {
  
    if (!oldPassword || !newPassword) {
      setDialougeTitle("Fields Are Empty");
      setVisible(true);
      return
    }

    dispatch(setLoading(true))
    try {
      const response = await authService.updatePassword(oldPassword,newPassword,userToken)
      if (response.success) {
        console.log(response)
       await  handleLogout()
        console.log("password changed successsfully");
        console.log(response)
      }

    } catch (error) {
      console.error(error);
      
      const message = error.message || 'Error occured';
     setDialougeTitle("Password Error");
      setDialougeContent(message);
      setVisible(true)
    } finally {
      dispatch(setLoading(false));

    }
  };

  const handleLogout = async()=>{
    try {
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
          <Text style={styles.title}>Update Password</Text>
          <View style={[styles.loginContainer, globalStyle.container]}>
            <View style={{ gap: 16 }}>
              <View style={{flexDirection:'column', gap:12}}>
               <TextInput
                                 style={styles.input}
                                 textColor="#000"
                                 secureTextEntry={onSecureTwo}
                                 mode="outlined"
                                 outlineColor="transparent"
                                 placeholder="Enter Your Old Password"
                                 placeholderTextColor="#A29999"
                                 left={<TextInput.Icon icon="lock" color="#A29999" />}
                                 right={onSecureTwo ? <TextInput.Icon icon="eye" color="#A29999" onPress={()=>setOnSecureTwo(prev=>!prev)}/> : <TextInput.Icon icon="eye-off" color="#A29999" onPress={()=>setOnSecureTwo(prev=>!prev)}/>}
                                 contentStyle={{
                                   fontFamily: "Fredoka-Regular",
                                   color: "#000",
                                 }}
                                 value={oldPassword}
                                 onChangeText={(oldPassword)=>setOldPassword(oldPassword)}
                               />
                <TextInput
                                 style={styles.input}
                                 textColor="#000"
                                 secureTextEntry={onSecureOne}
                                 mode="outlined"
                                 outlineColor="transparent"
                                 placeholder="Enter Your New Password"
                                 placeholderTextColor="#A29999"
                                 left={<TextInput.Icon icon="lock" color="#A29999" />}
                                 right={onSecureTwo ? <TextInput.Icon icon="eye" color="#A29999" onPress={()=>setOnSecureOne(prev=>!prev)}/> : <TextInput.Icon icon="eye-off" color="#A29999" onPress={()=>setOnSecureTwo(prev=>!prev)}/>}
                                 contentStyle={{
                                   fontFamily: "Fredoka-Regular",
                                   color: "#000",
                                 }}
                                 value={newPassword}
                                 onChangeText={(newPassword)=>setNewPassword(newPassword)}
                               />
              </View>
             
              <Button
                mode="contained"
                style={[styles.button, isLoading && { opacity: 0.8 }]}
                labelStyle={{ fontFamily: "Fredoka-Regular" }}
                onPress={() => handleUpdatePassword()}
                disabled={isLoading}
              >
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {isLoading && <ActivityIndicator color="#FFF" />}
                  <Text
                    style={{ fontFamily: "Fredoka-Regular", color: "#fff" }}
                  >
                    {" "}
                    {isLoading ? "Updating" : "Update Password"}
                  </Text>
                </View>
              </Button>
            </View>
           
          </View>
        </View>
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
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
              <Dialog.Title
                style={{
                  fontFamily: "Fredoka-Semibold",
                  color: Colors.primary,
                  textAlign: "center",
                }}
              >
                {dialougeTitle && dialougeTitle}
              </Dialog.Title>
              <Dialog.Content>
                <Text
                  variant="bodyMedium"
                  style={{
                    fontFamily: "Fredoka-Regular",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  {dialougeContent && dialougeContent}
                </Text>
              </Dialog.Content>
            </Dialog>
          </Portal>
        </View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

export default ForgotPassword;

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
});
