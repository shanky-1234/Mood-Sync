import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
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
import { useState } from "react";
import authService from "../Service/auth";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToken, setUser } from "../redux/slices/authSlice";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [dialougeTitle, setDialougeTitle] = useState("");
  const [dialougeContent, setDialougeContent] = useState("");

  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    dispatch(setLoading(true));
    if (!email || !password) {
      setDialougeTitle("Fields Are Empty");
      setVisible(true);
    }

    if (!email.includes("@")) {
      setDialougeTitle("Email Not Valid");
      setDialougeContent("");
      setVisible(true);
    }

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
      
      const message = error.message;
      if (message) {
        setDialougeTitle(message);
        setDialougeContent("");
        setVisible(true);
      }
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
                  secureTextEntry
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Your Password"
                  placeholderTextColor="#A29999"
                  left={<TextInput.Icon icon="lock" color="#A29999" />}
                  right={<TextInput.Icon icon="eye" color="#A29999" />}
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
                Don't Have an Account ?
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
                href={"../(tabs)/"}
              >
                Home
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
