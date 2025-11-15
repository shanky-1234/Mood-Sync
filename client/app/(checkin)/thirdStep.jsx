import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import StepProgress from "../components/StepProgress";
import { globalStyle } from "../Constants/globalStyles";
import { Button, PaperProvider, Portal, SegmentedButtons, Snackbar,TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { Colors } from "../Constants/styleVariable";
import Swiper from "react-native-swiper";
import MultiSelectOptions from "../components/MultiSelectOptions";
const thirdStep = () => {
  const [allSelections, setAllSelections] = useState({});
  const [customInput,setCustomInput] = useState({})
  const [snackBarVisible,setSnackBarVisible] = useState(false)
  const allSelectedValues = Object.values(allSelections).flat();
console.log(allSelectedValues);
  const currentStep = 2;
  const router = useRouter();
  const handleLinking = () => {
    router.back();
  };
  const activities = [
    [
      { value: "exercise", label: "Exercise", icon: "run",uncheckedColor:Colors.primary,  style:{borderColor:Colors.primary} },
      { value: "sleep", label: "Sleep", icon: "sleep" },
      { value: "coffee", label: "Coffee", icon: "coffee" },
    ],
    [
      { value: "music", label: "Music", icon: "music" },
      { value: "meditation", label: "Meditation", icon: "meditation" },
      { value: "sunshine", label: "Sunshine", icon: "white-balance-sunny" },
    ],
    [
      { value: "socialtime", label: "Social Time", icon: "account-group" },
      { value: "food", label: "Food", icon: "food-apple" },
      { value: "gaming", label: "Gaming", icon: "gamepad-variant" },
    ],
    [
      { value: "reading", label: "Reading", icon: "book-open-variant" },
      { value: "screentime", label: "Screen Time", icon: "cellphone" },
      { value: "alcohol", label: "Alcohol", icon: "glass-cocktail" },
    ],
    [
      { value: "naturewalk", label: "Nature Walk", icon: "tree" },
      { value: "sugar", label: "Sugar", icon: "candy" },
      { value: "stress", label: "Stress", icon: "alert-circle" },
    ],
    [
      { value: "laughter", label: "Laughter", icon: "emoticon-happy" },
      { value: "coldshower", label: "Cold Shower", icon: "shower" },
      { value: "dancing", label: "Dancing", icon: "human-handsup" },
    ],
  ];
  const handleValues = (newValue)=>{
    setValue(newValue)
  }
  const pages = [activities.slice(0, 3), activities.slice(3, 6)];
  return (
    <PaperProvider>
    <View style={[styles.mainContainer]}>
      <View style={{ paddingHorizontal: 28, marginTop: 28 }}>
        <StepProgress currentStep={currentStep} progressLink={handleLinking} />
      </View>
      <View style={styles.mascotContainer}>
        <Image
          source={require("../../assets/mascot/tips.png")}
          style={styles.mascotStyle}
          resizeMode="contain"
        />
        <View style={styles.speechBox}>
          <View style={styles.triangle} />
          <Text
            style={{
              fontFamily: "Fredoka-Regular",
              fontSize: 20,
              color: "white",
              textAlign: "center",
            }}
          >
            Okay!
          </Text>
          <Text
            style={{
              fontFamily: "Fredoka-Medium",
              fontSize: 28,
              color: "white",
              textAlign: "center",
            }}
          >
            What is the cause for it ?
          </Text>
        </View>
      </View>

      <View style={{height: 220,
  marginTop: 8,
  marginBottom: 20,}}>
      <Swiper
      
        dotColor={"#FFC2C0"}
        activeDotColor={Colors.primary}
        activeDotStyle={{ width: 14, height: 14, borderRadius: 200 }}
        style={[
          { paddingHorizontal: 28, justifyContent: "center", marginTop: 28, },
        ]}
        paginationStyle={{bottom:-10 }}
      >
        {pages.map((item, index) => (
          <View>
            {item.map((items, index) => {
              return (
                <MultiSelectOptions
                key={index}
  items={items}
  index={index}
  limit={4}
  value={allSelections[index] || []}
  onChange={(newValue) => {
    const otherValues = Object.entries(allSelections)
      .filter(([key]) => key != index)
      .map(([_, vals]) => vals)
      .flat();
    const combined = [...otherValues, ...newValue];
    if (combined.length > 4) {
      setSnackBarVisible(true)
      return
    } // just stop if over limit
    setAllSelections(prev => ({ ...prev, [index]: newValue }));
  }}
/>
              );
            })}
          </View>
        ))}
      </Swiper>
      </View>
      <View style={{paddingHorizontal:28}}>
      <TextInput
                  value={customInput}
                  style={styles.input}
                  secureTextEntry
                  mode="outlined"
                  outlineColor="transparent"
                  placeholder="Enter Custom Word"
                  placeholderTextColor="#A29999"
                  
                  contentStyle={{
                    fontFamily: "Fredoka-Regular",
                  }}
                  onChangeText={(customInput) => setCustomInput(customInput)}
                />
                  <Button style={styles.button} mode='contained' onPress={()=>router.push('./fourthStep')}><Text
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
    
          
      <Portal>
        <Snackbar visible={snackBarVisible} duration={2000} onDismiss={()=>setSnackBarVisible(false)}>
          The limit is 4
        </Snackbar>
      </Portal>
    </View>
    </PaperProvider>
  );
};

export default thirdStep;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FCE9E7",
    flex: 1,
  },
  options: {
    width: 350,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotStyle: {
    width: 105,
    height: 80,
    transform: [{ rotate: "34deg" }],
    position: "absolute",
    top: 0,
    left: -45,
  },
  mascotContainer: {
    position: "relative",
    height: 120,
    marginTop: 60,
  },
  speechBox: {
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginLeft: 70,
    marginRight: 28,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  triangle: {
    position: "absolute",
    bottom: 80,
    left: -8,
    width: 20,
    height: 20,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderRightWidth: 16,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Colors.primary,
    transform: [{ rotate: "50deg" }],
  },
   input: {
    
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  button: {
      marginTop: 24,
      backgroundColor:Colors.primary,
      borderRadius: 8,
      height: 56,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
});
