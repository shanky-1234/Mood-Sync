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

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [dialougeTitle, setDialougeTitle] = useState("");
  const [dialougeContent, setDialougeContent] = useState("");
  const { isLoading } = useSelector((state) => state.auth);
  const [userInfo,setUserInfo] = useState([])
  const dispatch = useDispatch();
  
 
 
  const handleVerification = async () => {
  
    if (!email) {
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
      const response = await authService.verifyEmail(email)
      if (response.success === true) {
        router.replace({
            pathname:'./EmailVerificationPassword/',
            params:{email}
        })
        console.log("loggedinsuccessfully");
        console.log(response)
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
          <Text style={styles.title}>Forgot Password</Text>
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
             
              <Button
                mode="contained"
                style={[styles.button, isLoading && { opacity: 0.8 }]}
                labelStyle={{ fontFamily: "Fredoka-Regular" }}
                onPress={() => handleVerification()}
                disabled={isLoading}
              >
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {isLoading && <ActivityIndicator color="#FFF" />}
                  <Text
                    style={{ fontFamily: "Fredoka-Regular", color: "#fff" }}
                  >
                    {" "}
                    {isLoading ? "Verifying" : "Verify Email"}
                  </Text>
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
                Dont Have an Account ?
              </Text>
              <Link
                style={{
                  color: Colors.primary,
                  marginTop: 8,
                  fontFamily: "Fredoka-Regular",
                }}
                href={"./EmailVerificationPassword/"}
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
