import { SplashScreen, Stack, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { View, ActivityIndicator } from "react-native";
import { Colors } from "./Constants/styleVariable";
import { setLoading, setToken, setUser } from "./redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";


SplashScreen.preventAutoHideAsync();

function RouteRoots() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const data = await AsyncStorage.getItem("UserData");
        const tokenData = await AsyncStorage.getItem("UserToken");

        if (data && tokenData) {
          const parsed = JSON.parse(data);
          dispatch(setUser(parsed));
          dispatch(setToken(tokenData));
          setIsLoggedIn(true);
          router.replace("/(tabs)");
        } else {
          setIsLoggedIn(false);
          router.replace("/authPages/Login");
        }
      } catch (error) {
        console.log("Error loading user data:", error);
        router.replace("/authPages/Login");
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkLogin();
  }, []);

 

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="authPages/Login" options={{ headerShown: false }} />
      <Stack.Screen
        name="authPages/CreateAccount"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="authPages/OnboardingAuth"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profile/ProfilePage"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(checkin)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka-Light": require("../assets/fonts/Fredoka-Light.ttf"),
    "Fredoka-Medium": require("../assets/fonts/Fredoka-Medium.ttf"),
    "Fredoka-Semibold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
    "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
    "JosefinSlab-Bold": require("../assets/fonts/JosefinSlab-Bold.ttf"),
    "JosefinSlab-Medium": require("../assets/fonts/JosefinSlab-Medium.ttf"),
    "JosefinSlab-Regular": require("../assets/fonts/JosefinSlab-Regular.ttf"),
    "JosefinSlab-SemiBold": require("../assets/fonts/JosefinSlab-SemiBold.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync(); // ✅ Hide splash screen when fonts are ready
      }
    };
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primary,
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <RouteRoots />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
