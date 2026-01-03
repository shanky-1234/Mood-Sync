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
import { KeyboardAvoidingView,ScrollView } from "react-native";
import { useRef, useState } from "react";
import authService from "../Service/auth";
import { useDispatch, useSelector } from "react-redux";
import { setIsGoogleAccount, setLoading, setToken, setUser } from "../redux/slices/authSlice";

import { useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams } from "expo-router";





const GoogleSign = () => {
  const router = useRouter();
  const {email,fullname,googleId} = useLocalSearchParams()
  
  const [age, setAge]  = useState("");
  const [gender,setGender] = useState("")

  
  const { isLoading } = useSelector((state) => state.auth);
  const [userInfo,setUserInfo] = useState([])
  const dispatch = useDispatch();
 useEffect(()=>{
    console.log(email)
 })

 const handleGoogleSignIn = async() =>{
    try {
        const response = await authService.googleAuth(googleId,fullname,email,age,gender)
        if(response.success){
        if (response.success === true) {
        dispatch(setUser(response.user))
        dispatch(setToken(response.generate))
        dispatch(setIsGoogleAccount(response.googleSignIn))
        console.log("loggedinsuccessfully");
        console.log(response)
        
        router.replace("/(tabs)");
      }

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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Logo */}
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Image
                source={require("../../assets/logos/MoodSync.png")}
                style={{ width: 200, height: 50 }}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Google Sign In</Text>

            <View style={[styles.loginContainer, globalStyle.container]}>
              <View style={{ gap: 16, padding: 16 }}>
                {/* Info Text */}
                <View style={{ alignItems: "center", marginBottom: 24 }}>
                  <Text
                    style={{
                      width: "80%",
                      fontFamily: "Fredoka-Regular",
                      fontSize: 16,
                      color: "#A29999",
                      textAlign: "center",
                    }}
                  >
                    Before we continue, give some little detail about you!
                  </Text>
                </View>
                 <TextInput
                                  style={styles.input}
                                  disabled
                                  keyboardType="default"
                                  mode="outlined"
                                  outlineColor="transparent"
                                  placeholderTextColor="#A29999"
                                  left={<TextInput.Icon icon="account" color="#A29999" />}
                                  contentStyle={{
                                    fontFamily: "Fredoka-Regular",
                                  }}
                                  value={fullname}
                                  
                                />
                <TextInput
                  value={email}
                  disabled
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Your Email"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="email" color="#A29999" />}
                  
                  contentStyle={{ fontFamily: "Fredoka-Regular" }}
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      value={age}
                      style={styles.input}
                      keyboardType="numeric"
                      mode="outlined"
                      placeholder="Enter Age"
                      outlineColor="transparent"
                      placeholderTextColor="#A29999"
                      left={<TextInput.Icon icon="account" color="#A29999" />}
                      contentStyle={{ fontFamily: "Fredoka-Regular" }}
                      onChangeText={(text) => setAge(text)}
                      maxLength={2}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <RNPickerSelect
                      placeholder={{ label: "Select Gender" }}
                      useNativeAndroidPickerStyle={false}
                      style={{
                        inputAndroid: {
                          fontFamily: "Fredoka-Regular",
                          paddingHorizontal: 12,
                          borderRadius: 4,
                          backgroundColor: "#F5F5F5",
                          height: 56,
                          justifyContent: "center",
                        },
                        placeholder: {
                          fontFamily: "Fredoka-Regular",
                          fontSize: 16,
                          color: "#A29999",
                        },
                        iconContainer: {
                          marginRight: 12,
                          paddingTop: 20,
                          color: "#A29999",
                        },
                      }}
                      onValueChange={(value) => setGender(value)}
                      items={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                      ]}
                      Icon={() => <AntDesign name="caret-down" size={16} color="#A29999" />}
                      value={gender}
                    />
                  </View>
                </View>

                {/* Login Button */}
                <Button
                  mode="contained"
                  style={[styles.button, isLoading && { opacity: 0.8 }]}
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={{ color: "#FFF", fontFamily: "Fredoka-Regular" }}>
                      Continue
                    </Text>
                  )}
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

export default GoogleSign;

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
    height:"100%",
    marginTop: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth:0
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
