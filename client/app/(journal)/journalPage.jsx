import { BackHandler, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView,Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { globalStyle } from "../Constants/globalStyles";
import { Colors } from "../Constants/styleVariable";
import { TextInput, ActivityIndicator, PaperProvider,Dialog,Portal } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import jounralService from "../Service/journal";
import { setLoading } from "../redux/slices/authSlice";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const JournalPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [visible,setVisible] = useState(false)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("");
  const [fetchingJournal, setFetchingJournal] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const typingTimeout = useRef(null);

  const params = useLocalSearchParams();
  const journalId = params.journalId;

  

  const handleDelete = async(id)=>{
  console.log(id)
  try {
    const response = await jounralService.deleteJournal(id)
    if(response.success){
      console.log(response)
      setVisible(false)
      router.replace('../(tabs)/MyJournals')
    }
  } catch (error) {
    console.error(error)
  }
}

  const smartAutoSave = () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (!journalId) return;
      autoSave();
    }, 8000);
  };

  useEffect(() => {
    loadJournal();
  }, [journalId]);

  const loadJournal = async () => {
    if (params.title && params.color) {
      setTitle(params.title);
      setColor(params.color);
      setContent("");
      setFetchingJournal(false);
      return;
    }

    try {
      const res = await jounralService.getJournalById(journalId);
      if (res.success) {
        setTitle(res.journal.title);
        setContent(res.journal.content || "");
        setColor(res.journal.color || Colors.primary);
      }
    } catch (e) {}

    setFetchingJournal(false);
  };

  const autoSave = async () => {
    if (!journalId) return false;

    const payload = {
      title: title || "",
      content: content || "",
    };

    try {
      const res = await jounralService.updateJournal(journalId, payload);
      return res.success ? true : false;
    } catch (e) {
      return false;
    }
  };

  const handleBackPress = async () => {
    if (isSaving) return;

    setIsSaving(true);
    dispatch(setLoading(true));

    const saved = await autoSave();

    if (saved) {
      dispatch(setLoading(false));
      setIsSaving(false);
      router.back();
      return;
    }

    dispatch(setLoading(false));
    setIsSaving(false);

    Alert.alert("Save Error", "Unable to save. Try again?", [
      { text: "Cancel", style: "cancel" },
      { text: "Exit Without Saving", onPress: () => router.back() },
    ]);
  };

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => handler.remove();
  }, [title, content, color]);

  useEffect(() => {
    return () => {
      if (!isSaving && journalId) autoSave();
    };
  }, [title, content, color]);

  if (fetchingJournal) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ marginTop: 16, fontFamily: "Fredoka-Regular", color: "#fff" }}>Loading journal...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
    <View style={{ marginTop: 48, paddingBottom: 40, flex: 1 }}>
      <View
        style={[
          globalStyle.container,
          {
            backgroundColor: color,
            flex: 1,
            borderTopRightRadius: 60,
            borderTopLeftRadius: 60,
          },
        ]}
      >
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setVisible(true)}>
          <MaterialIcons name="delete-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ marginTop: 12,paddingBottom:100 }}>
          <TextInput
            value={title}
            mode="outlined"
            multiline
            style={{ outlineWidth: 0, marginTop: 24, backgroundColor: color }}
            outlineStyle={{ borderWidth: 0 }}
            textColor="white"
            cursorColor="white"
            contentStyle={{ fontFamily: "Fredoka-Medium", color: "white", fontSize: 32 }}
            placeholder="Type Your Title..."
            placeholderTextColor="#ffffffab"
            onChangeText={(t) => {
              setTitle(t);
              smartAutoSave();
            }}
          />

          <TextInput
            mode="outlined"
            multiline
            style={{ outlineWidth: 0, marginTop: 24, backgroundColor: color }}
            outlineStyle={{ borderWidth: 0 }}
            textColor="white"
            cursorColor="white"
            contentStyle={{ fontFamily: "Fredoka-Regular", fontSize: 16 }}
            placeholder="Type Your Day..."
            placeholderTextColor="#ffffffab"
            value={content}
            onChangeText={(t) => {
              setContent(t);
              smartAutoSave();
            }}
          />
        </ScrollView>
      </View>
      <View style={[{paddingBottom:50,
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            backgroundColor: "#fff",
            borderTopWidth: 2,
            borderTopColor: "#ccc",
            justifyContent: "center",
            },globalStyle.container]}>
            <Button style={[styles.button,{backgroundColor:color}]}><Text style={{fontFamily:'Fredoka-Medium',color:'#fff',gap:12}}>Analysis<MaterialCommunityIcons name="star-four-points" size={16} color='#fff' /></Text></Button>
      </View>
      <Portal>
                          <Dialog visible={visible} onDismiss={()=>setVisible(false)} >
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
                              <Dialog.Title style={{fontFamily:'Fredoka-Medium',fontSize:20,textAlign:'center',color:color}}>Do you wanna delete your Journal ?</Dialog.Title>
                              <Dialog.Actions style={{alignContent:'center',alignSelf:'center'}}>
                                <Button style={[{backgroundColor:color},styles.button]} onPress={()=>handleDelete(journalId)}><Text style={{fontFamily:'Fredoka-Regular',color:'#fff'}}>Delete</Text></Button>
                                <Button style={styles.button} ><Text  style={{fontFamily:'Fredoka-Regular',color:color}} onPress={()=>setVisible(false)}>Cancel</Text></Button>
                              </Dialog.Actions>
                          </Dialog>
                      </Portal>
    </View>
    </PaperProvider>
  );
};



export default JournalPage;

const styles = StyleSheet.create({
  button:{
    width:'40%',
    marginTop: 24,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
    
  }
});
