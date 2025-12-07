import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import StepProgress from "../components/StepProgress";
import { globalStyle } from "../Constants/globalStyles";
import { Button, PaperProvider, Portal, SegmentedButtons, Snackbar,TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { Colors } from "../Constants/styleVariable";
import Swiper from "react-native-swiper";
import MultiSelectOptions from "../components/MultiSelectOptions";

const fourthStep = () => {
  const [allSelections, setAllSelections] = useState({});
  const [customInput,setCustomInput] = useState({})
  const [snackBarVisible,setSnackBarVisible] = useState(false)
  const allSelectedValues = Object.values(allSelections).flat();
console.log(allSelectedValues);
  const currentStep = 3;
  const router = useRouter();
  const handleLinking = () => {
    router.back();
  };
  const activities = [
  [
    { value: "happy", label: "Happy", icon: "emoticon-happy-outline", uncheckedColor: Colors.primary, style: { borderColor: Colors.primary } },
    { value: "excited", label: "Excited", icon: "emoticon-excited-outline" },
    { value: "love", label: "Love", icon: "heart-outline" },
  ],
  [
    { value: "funny", label: "Funny", icon: "emoticon-lol-outline" },
    { value: "cringy", label: "Cringe", icon: "emoticon-confused-outline" },
    { value: "proud", label: "Proud", icon: "emoticon-happy" },
  ],
  [
    { value: "anxious", label: "Anxious", icon: "emoticon-worried-outline" },
    { value: "stressed", label: "Stressed", icon: "alert-circle-outline" },
    { value: "overwhelmed", label: "Overwhelmed", icon: "emoticon-sad-outline" },
  ],
  [
    { value: "scared", label: "Scared", icon: "emoticon-dead-outline" },
    { value: "confused", label: "Confused", icon: "help-circle-outline" },
    { value: "embarrassed", label: "Embarrassed", icon: "emoticon-embarrassed-outline" },
  ],
  [
    { value: "calm", label: "Calm", icon: "emoticon-cool-outline" },
    { value: "relaxed", label: "Relaxed", icon: "beach" },
    { value: "peaceful", label: "Peaceful", icon: "flower" },
  ],
  [
    { value: "angry", label: "Angry", icon: "emoticon-angry-outline" },
    { value: "jealous", label: "Jealous", icon: "eye-off-outline" },
    { value: "bored", label: "Bored", icon: "emoticon-sad-outline" },
  ]
]


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
                  <Image source={require('../../assets/mascot/tips.png')} style={styles.mascotStyle} resizeMode="contain"/>
                <View style={styles.speechBox}>
                  <View style={styles.triangle} />
                  <Text style={{fontFamily:'Fredoka-Regular',fontSize:20,color:'white',textAlign:'center'}}>
                    Alright then
                  </Text>
                    <Text style={{fontFamily:'Fredoka-Medium',fontSize:28,color:'white',textAlign:'center'}}>
                   What is your current mood ?
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
                  <Button style={styles.button} mode='contained' onPress={()=>router.push('./fifthStep')}><Text
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

export default fourthStep;

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
  mascotStyle:{
      width:105,
      height:80,
      transform:[{rotate:"-34deg"},{scaleX:-1}],
      position:'absolute',
      top:0,
      right: -45,
    },
    mascotContainer:{
      position: 'relative',
      height: 120,
      marginTop: 48,
    },
      speechBox:{
      justifyContent:'center',
      backgroundColor: '#5E4C4B',
      borderRadius: 32,
      paddingVertical: 32,
      paddingHorizontal: 32,
      marginRight: 70, 
      marginLeft:28,
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
      position: 'absolute',
      bottom: 80,
      right: -8,
      width: 20,
      height: 20,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 0,
      borderRightWidth: 16,
      borderBottomWidth: 16,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#5E4C4B',
      transform: [{ rotate: '-130deg' }],},
  button: {
      marginTop: 24,
      backgroundColor:'#5E4C4B',
      borderRadius: 8,
      height: 56,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
});
