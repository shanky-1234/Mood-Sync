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
import { Link, useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import authService from "../Service/auth";
import {useDispatch, useSelector} from 'react-redux'
import { setIsGoogleAccount, setLoading, setToken, setUser } from "../redux/slices/authSlice";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useRoute } from "@react-navigation/native";

const CreateAccount = () => {
 const [visible, setVisible] = useState(false)
 const [dialougeTitle,setDialougeTitle] = useState('');
 const [dialougeContent,setDialougeContent] = useState('');
 


  const [fullname,setFullname] = useState('')
  const [age,setAge] = useState(null)
  const [gender,setGender] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
   const [onSecure,setOnSecure] = useState(true)
    const [onSecureTwo,setOnSecureTwo] = useState(true)
  const {isLoading} = useSelector((state)=>state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    const user = await GoogleSignin.signIn();
    console.log("Google Sign-In response:", user); // log raw response

    // directly update state
     
  
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


  const handleRegisterAccount = async () =>{
    console.log(fullname,age,gender,email,password,confirmPassword)
    

    const hasNumber = /\d/.test(password)  // Check for at least one number
    const hasCharacter = /[a-zA-Z]/.test(password)  // Check for at least one letter
    const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    
    const ageNum = parseInt(age) 
    const userData = {fullname,age:ageNum,gender,email,password}
    try {
      
      if(!fullname || !age || !gender || !password || !confirmPassword){
          setDialougeTitle('Fields are Empty')
          setDialougeContent('Fill all the fields!')
          setVisible(true)
          return
        }

      if(age<14){
        setDialougeTitle('Age Limit Warning')
        setDialougeContent('Must Be above 14')
        setVisible(true)
        return
      }
         if(!email.includes('@')){
        setDialougeTitle('Email Not Valid')
          setDialougeContent('Your Email is Not Valid')
          setVisible(true)
          return
      }

      if(password.length <=6 || !hasCharacter || !hasNumber ||!hasSpecialCharacters){
        setDialougeTitle('Password is Weak')
          setDialougeContent('Password must be minimum 6 Characters and Must contain numerical,Capital Letter and speacial characters')
          setVisible(true)
       return
      }

      if(password !== confirmPassword){
        setDialougeTitle('Password Doesnt Match!')
          setDialougeContent('Double Check your password so you wont forget')
          setVisible(true)
         return
      }      

      dispatch(setLoading(true))
      
      const response = await authService.normalRegistration(userData)
      if(response){
        console.log('success')
        setVisible(true)
        setDialougeTitle('Account Sucessfully Created')
        setDialougeContent('')
        setFullname('')
        setAge('')
        setGender('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      console.log(error)
       const errorMessage = error.message
       console.log(errorMessage)
      if (errorMessage) {
    setDialougeTitle('Registration Failed')
    setDialougeContent(errorMessage)  
    setVisible(true)
  } //error cominng from server
    } finally{
      dispatch(setLoading(false))
      console.log('loading reset')
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
        <Text style={styles.title}>Create Account</Text>

        <View style={[styles.loginContainer, globalStyle.container]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: "80%" }}
            style={{ flex: 1 }}
          >
            <View style={{ gap: 16 }}>
              <View>
                <TextInput
                  style={styles.input}
                  keyboardType="default"
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Your Full Name"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="account" color="#A29999" />}
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  value={fullname}
                  onChangeText={(fullname)=>setFullname(fullname)}
                />
               {fullname && /[!@#$%^&*()_+{}|:";'<>,.?/~`0-9]/.test(fullname) ? (
    <Text style={styles.errorText}>
      Write Appropritae Name
    </Text>
  ) : null}

              </View>

              <View style={{ flex: 1, flexDirection: "row", gap: 8 ,width:'100%'}}>
                <View style={{flexDirection:'column',width:'50%',height:'100%'}}>
                <TextInput
                  style={[styles.input]}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Age"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="account" color="#A29999" />}
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  value={age}
                  maxLength={2}
                  onChangeText={(age)=>setAge(age)
                  }
                  
                />
                {
                  age && isNaN(age) ? 
                  <Text style={styles.errorText}>Enter Number</Text>:
                  null
                }
                
                </View>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    placeholder={{
                      label: "Select Gender",
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputAndroid: {
                        fontFamily: "Fredoka-Regular",
                        paddingHorizontal: 12,
                        
                        borderRadius: 4,
                        backgroundColor: "#F5F5F5",
                        height: "100%",
                      },
                      placeholder:{
                        fontFamily: "Fredoka-Regular",
                        fontSize:16,
                        color: "#A29999",
                      },
                      iconContainer:{
                        marginRight:12,
                        paddingTop:20,
                        color:'#A29999'
                      }
                    }}
                    onValueChange={(gender) => setGender(gender)}
                    items={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                    Icon={()=>(<AntDesign name="caret-down" size={16} color="#A29999" />)}
                    value={gender}
                  />
                </View>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Email"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="email" color="#A29999" />}
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  value={email}
                  onChangeText={(email)=>setEmail(email)}
                />
                {
                  
                }
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  secureTextEntry={onSecure}
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Password (Min:8 Char)"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="lock" color="#A29999" />}
                  right={onSecure ? <TextInput.Icon icon="eye" color="#A29999" onPress={()=>setOnSecure(prev=>!prev)}/> : <TextInput.Icon icon="eye-off" color="#A29999" onPress={()=>setOnSecure(prev=>!prev)}/>}
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  value={password}
                  onChangeText={(password)=>setPassword(password)}
                />
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  secureTextEntry={onSecureTwo}
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Confirm Password"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="lock" color="#A29999" />}
                  right={onSecureTwo ? <TextInput.Icon icon="eye" color="#A29999" onPress={()=>setOnSecureTwo(prev=>!prev)}/> : <TextInput.Icon icon="eye-off" color="#A29999" onPress={()=>setOnSecureTwo(prev=>!prev)}/>}
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  value={confirmPassword}
                  onChangeText={(confirmPassword)=>setConfirmPassword(confirmPassword)}
                />
              </View>
            </View>
             
            <View>
              <Button
                mode="contained"
                style={[styles.button,isLoading && {opacity:0.8}]}
                labelStyle={{ fontFamily: "Fredoka-Regular" }}
                onPress={()=>handleRegisterAccount()}
                disabled={isLoading}
              >
                <View style={{flexDirection:'row',gap:4}}>
                {
                  isLoading && <ActivityIndicator color='#FFF' />
                }
                <Text style={{fontFamily: "Fredoka-Regular",color:'#fff'}}> {isLoading ? "Creating Account" : "Create Account"}</Text>
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
                Already Have an Account ?
              </Text>
              <Link
                style={{
                  color: Colors.primary,
                  marginTop: 8,
                  fontFamily: "Fredoka-Regular",
                }}
                href={"./Login/"}
              >
                Login Account
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

export default CreateAccount;

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
  }
});
