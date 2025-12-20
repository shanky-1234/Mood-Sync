import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser, setToken } from "../redux/slices/authSlice";
import { setCheckInInfo } from "../redux/slices/checkinSlice";
import api from "../Service/api";

export const getCurrentStreak = (streaks) => {
  if (!streaks || !streaks.lastDate) return 0;

  const today = new Date();
  today.setHours(0,0,0,0); // reset time

  const lastCheckIn = new Date(streaks.lastDate);
  lastCheckIn.setHours(0,0,0,0);

  const diffDays = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));

  // If streak is broken
  if (diffDays > 1) return 0;

  // Streak is still active
  return streaks.current || 0;
};

export const fetchAndUpdateUser = async (dispatch) => {
  try {
    const storedToken = await AsyncStorage.getItem("UserToken");

    if (!storedToken) return null;

    const verifyResponse = await api.get("auth/verify", {
      headers: { Authorization: `Bearer ${storedToken}` },
    });

    if (!verifyResponse.data.success) {
      dispatch(setUser(null));
      dispatch(setToken(null));
      await AsyncStorage.removeItem("UserData");
      await AsyncStorage.removeItem("UserToken");
      
      return null;
    }
    
    const profileResponse = await api.get("auth/profile", {
      headers: { Authorization: `Bearer ${storedToken}` },
    });

    const getCheckInToday = await api.get('checkIn/getCheckInToday')

    const checkInTodayDataCount = getCheckInToday.data

    const freshUser = profileResponse.data.userData;

    const currentStreak = getCurrentStreak(freshUser.streaks)

    freshUser.streaks.current = currentStreak

    
    console.log(freshUser)
    // STEP 3 — Update redux + local storage
    dispatch(setUser(freshUser));
    dispatch(setToken(storedToken));
    dispatch(setCheckInInfo(checkInTodayDataCount))
    await AsyncStorage.setItem("UserData", JSON.stringify(freshUser));
    await AsyncStorage.setItem("CheckInData",JSON.stringify(checkInTodayDataCount))


    // STEP 4 — Return clean user
    return freshUser,getCheckInToday;

  } catch (error) {
    console.log("Error fetching user:", error);
    return null;
  }
};
