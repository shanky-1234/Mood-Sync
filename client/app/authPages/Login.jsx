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



GoogleSignin.configure({
  webClientId:process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
})

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onSecure,setOnSecure] = useState(true)
  const [visible, setVisible] = useState(false);
  const [dialougeTitle, setDialougeTitle] = useState("");
  const [dialougeContent, setDialougeContent] = useState("");
  const [isExtraInfo,setIsExtraInfo] = useState(false)
  const { isLoading } = useSelector((state) => state.auth);
  const [userInfo,setUserInfo] = useState([])
  const dispatch = useDispatch();
  
 const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    const user = await GoogleSignin.signIn();
    console.log("Google Sign-In response:", user); // log raw response

    if(user.data !=null){
    setUserInfo(user.data.user); 
    console.log(userInfo)
    const response = await authService.googleAuth(user.data.user.id,user.data.user.name,user.data.user.email)
    console.log('auth',response)
    if(response.needsExtraInfo){
      const {googleId,fullname,email} = response.user
     
      router.replace({
        pathname:'./GoogleSign',
        params:{
         email: response.user.email,
    fullname: response.user.fullname,
    googleId: response.user.googleId,
        }
      })
    }else{
       dispatch(setUser(response.user))
        dispatch(setToken(response.generate))
        dispatch(setIsGoogleAccount(response.googleSignIn))
        console.log("loggedinsuccessfully");
        console.log(response)
        router.replace("/(tabs)");
    }
    }
    
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          Alert.alert('Sign in is already in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert('Google Play Services not available');
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          Alert.alert('Sign in was cancelled');
          break;
        default:
          Alert.alert('Google Sign-In Error');
      }
    } else {
      Alert.alert("Unexpected error");
    }
  }
};


 
  const handleLogin = async () => {
  
    if (!email || !password) {
      setDialougeTitle("Fields Are Empty");
      setVisible(true);
      return
    }

    if (!email.includes("@")) {
      setDialougeTitle("Email Not Valid");
      setDialougeContent("");
      setVisible(true);
      return
    }
    dispatch(setLoading(true))
    try {
      const response = await authService.login(email, password);
      if (response.success === true) {
        dispatch(setUser(response.getUser))
        dispatch(setToken(response.generateToken))
        console.log("loggedinsuccessfully");
        console.log(response)
        
        router.replace("/(tabs)");
      }

    } catch (error) {
      console.error(error);
      
      const message = error.message || 'Error occured';
     setDialougeTitle("Login Error");
      setDialougeContent(message);
      setVisible(true)
    } finally {
      dispatch(setLoading(false));

    }
  };
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
          <Text style={styles.title}>Log-In</Text>
          <View style={[styles.loginContainer, globalStyle.container]}>
            <View style={{ gap: 16 }}>
              <View>
                <TextInput
                  value={email}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Your Email"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="email" color="#A29999" />}
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  onChangeText={(email) => setEmail(email)}
                />
              </View>
              <View>
                <TextInput
                  value={password}
                  style={styles.input}
                  secureTextEntry={onSecure}
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Your Password"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="lock" color="#A29999" />}
                  right={onSecure ? <TextInput.Icon icon="eye" color="#A29999" onPress={()=>setOnSecure(prev=>!prev)} /> :<TextInput.Icon icon="eye-off" color="#A29999" onPress={()=>setOnSecure(prev=>!prev)} /> }
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  onChangeText={(password) => setPassword(password)}
                />
              </View>
            </View>
            <View>
              <Button
                mode="contained"
                style={[styles.button, isLoading && { opacity: 0.8 }]}
                labelStyle={{ fontFamily: "Fredoka-Regular" }}
                onPress={() => handleLogin()}
                disabled={isLoading}
              >
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {isLoading && <ActivityIndicator color="#FFF" />}
                  <Text
                    style={{ fontFamily: "Fredoka-Regular", color: "#fff" }}
                  >
                    {" "}
                    {isLoading ? "Logging In" : "Log In"}
                  </Text>
                </View>
              </Button>
              <Button
                mode="text"
                labelStyle={{
                  fontFamily: "Fredoka-Regular",
                  color: Colors.primary,
                  marginTop: 16,
                }}
              >
                Forgot Password ?
              </Button>
              
            </View>

            <Text style={{ textAlign: "center", marginTop: 20 }}>OR</Text>
            <Button
              onPress={handleGoogleSignIn}
              mode="outlined"
              style={styles.buttonOutlined}
              labelStyle={{
                fontFamily: "Fredoka-Regular",
                color: Colors.primary,
                marginTop: 16,
              }}
              contentStyle={{
                alignContent: "center",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={require("../../assets/icons/google.png")}
                  style={{ width: 18, height: 18, marginRight: 8 }}
                  
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: "black",
                    fontFamily: "Fredoka-Regular",
                  }}
                >
                  Continue With Google
                </Text>
              </View>
            </Button>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                marginTop: 60,
              }}
            >
              <Text style={{ fontFamily: "Fredoka-Regular" }}>
                Dont Have an Account ?
              </Text>
              <Link
                style={{
                  color: Colors.primary,
                  marginTop: 8,
                  fontFamily: "Fredoka-Regular",
                }}
                href={"./CreateAccount/"}
              >
                Create Account
              </Link>
               <Link
                style={{
                  color: Colors.primary,
                  marginTop: 8,
                  fontFamily: "Fredoka-Regular",
                }}
                href={"./OnboardingAuth/"}
              >
                What is Mood Sync ?
              </Link>
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

export default Login;

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
