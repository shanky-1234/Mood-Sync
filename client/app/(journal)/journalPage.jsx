import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { globalStyle } from "../Constants/globalStyles";
import { Colors } from "../Constants/styleVariable";
import {
  TextInput,
  ActivityIndicator,
  PaperProvider,
  Dialog,
  Portal,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import jounralService from "../Service/journal";
import { setLoading } from "../redux/slices/authSlice";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PermissionsAndroid, Platform, Linking } from "react-native";
import { start, stop, subscribe, cancel } from "react-native-rn-voicekit";
import {UseStoredJournalData} from '../Context/StoredJournal'
import * as ImagePicker from 'expo-image-picker';

const JournalPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [isListening, setIsListening] = useState(false);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("");
  const [fetchingJournal, setFetchingJournal] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [journalData, setJournalData] = useState(null)
  const typingTimeout = useRef(null);
  const {setJournalResult} = UseStoredJournalData()
  const [analyzing, setAnalyzing] = useState(false)
  const [isLoaded,setIsLoaded]=useState(false)
  const [photo,setPhoto] = useState([])
  const [uploading,setUploading] = useState(false)
  const params = useLocalSearchParams();
  const journalId = params.journalId;
  const isStartingRef = useRef(false)

  // //For Voice
  const startVoice = async () => {
     if (isListening || isStartingRef.current) return;

  isStartingRef.current = true;
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "We need access to your microphone for speech to text",
          buttonPositive: "OK",
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        isStartingRef.current = false;
        Alert.alert(
          "Permission required",
          "Microphone access is required to use voice mode.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }

   

    try {
      await cancel();   // REQUIRED
await start();  
      setIsListening(true);
    } catch (error) {
      console.error(error);
      setIsListening(false);
    }finally{
      isStartingRef.current = false
    }


  };

useEffect(() => {
  const unsub = subscribe({
    onSpeechStart: () => {
      console.log("Speech started");
    },

    onSpeechResults: (results) => {
      setContent(prev => {
    const updated = prev + " " + results.join(" ");
    console.log("Transcribed:", updated);
    return updated;
  });
    },

    onSpeechEnd: () => {
      setIsListening(false);
    },

    onSpeechError: (err) => {
      console.error("Speech Error", err);
      setIsListening(false);
    },
  });

  return () => {
    unsub?.();
    cancel();
  };
}, []);


  const stopVoice = async() => {
    try {
      await stop();
    await cancel();
    } catch (error) {
      console.error(error)
    }
    setIsListening(false);
  };

  const cancelVoice = () => {
    cancel();
    setIsListening(false);
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await jounralService.deleteJournal(id);
      if (response.success) {
        console.log(response);
        setVisible(false);
        router.replace("../(tabs)/MyJournals");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const smartAutoSave = () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
     if (journalData?.status === 'analysisCompleted') return;
    typingTimeout.current = setTimeout(() => {
      if (!journalId) return;
      autoSave();
    }, 2500);
  };

  useEffect(() => {
    loadJournal();
  }, [journalId]);

  const loadJournal = async () => {
    if (params.title && params.color) {
      const draftJournal = {
    _id: journalId || null,
    title: params.title,
    content: "",
    color: params.color,
    status: "draft"
  };
      setTitle(draftJournal.title);
  setContent("");
  setColor(draftJournal.color);
  setJournalData(draftJournal); // ✅ THIS WAS MISSING
  setIsLoaded(true);
  setFetchingJournal(false);
  setPhoto([]);
  return 
    }

    try {
      const res = await jounralService.getJournalById(journalId);
      if (res.success) {
        setTitle(res.journal.title);
        setContent(res.journal.content || "");
        setColor(res.journal.color || Colors.primary);
        setJournalData(res.journal)
        setIsLoaded(true)
        setPhoto(res.journal.photos || []);
      }
    } catch (e) {}

    setFetchingJournal(false);
  };

  const autoSave = async () => {
    if (!isLoaded) return true;
    if (!journalId) return true;
    if(journalData?.status === "analysisCompleted") return true
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
      router.replace('/(tabs)/MyJournals');
      return;
    }

    dispatch(setLoading(false));
    setIsSaving(false);

    Alert.alert("Save Error", "Unable to save. Try again?", [
      { text: "Cancel", style: "cancel" },
      { text: "Exit Without Saving", onPress: () => router.back() },
    ]);
  };

  const analyzeAI =async(id)=>{
    console.log('AI Analysis')
    if (!id) return
    try {
      console.log('AI Analysis started')
      setAnalyzing(true)
      dispatch(setLoading(true))

      await autoSave()


      const res = await jounralService.analyzeJournal(id)

      if(res.success){
        setJournalData(res.getJournal)
        setJournalResult(res)
        router.push({
          pathname:'../completeAnalysis/analysisComplete',
          params:{
            type:'journal',
            journalId:id}
        })
      }
      
    } catch (error) {
      console.error('An error Occured')
    }
    finally{
       dispatch(setLoading(false));
    setAnalyzing(false);
    }
  }

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => handler.remove();
  }, [title, content, color]);

   const showAnalysis = (id)=>{
        router.push({
          pathname:'../completeAnalysis/Analysis',
          params:{
            type:'journal',
            journalId:id
          }
        
        })
   }

  useEffect(() => {
    return () => {
      if (!isSaving && journalId && journalData?.status !== 'analysisCompleted')
      autoSave();
    };
  }, [title, content, color, journalData?.status]);

  if (fetchingJournal || analyzing || !journalData) {
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
        <Text
          style={{
            marginTop: 16,
            fontFamily: "Fredoka-Regular",
            color: "#fff",
          }}
        >
         Loading
        </Text>
      </View>
    );
  }
const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
   if (!result.canceled) {
    const selectedImage =  result.assets[0]

    const tempPhoto = {
      uri:selectedImage.uri,
      uploaded:false
    }
   setPhoto(prevResult => [...prevResult, tempPhoto]);

   await uploadImagetoServer(selectedImage)
  }
  };
  const uploadImagetoServer = async(asset)=>{
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("photos",{
        uri:asset.uri,
        type:asset.mimeType || 'image/jpeg',
        name:asset.filename || `photo.${asset.mimeType?.split('/')[1] || 'jpg'}`
      })

      const res = await jounralService.uploadPhoto(journalId,formData)
      if (res.success){
        console.log('Photo Uploaded!')
        setPhoto(res.photos)
      }
    } catch (error) {
      console.error(error)
    }
    finally{
      setUploading(false)
    }
  }

  

  const takePhoto = async() =>{
    const permissionResult = ImagePicker.getCameraPermissionsAsync()
  
    const result = await ImagePicker.launchCameraAsync({
     mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

     if (!result.canceled) {
   const selectedImage =  result.assets[0]

    const tempPhoto = {
      uri:selectedImage.uri,
      uploaded:false
    }
   setPhoto(prevResult => [...prevResult, tempPhoto]);

   await uploadImagetoServer(selectedImage)
  }
  }

  const handleDeletePhoto = async (id,photoId) =>{
      try {
        setUploading(true)
        const res = await jounralService.deletePhotos(id,photoId)

        if(res.success){
          console.log('delete successful')
          setPhoto(res.photos)
        }
      } catch (error) {
        console.error(error);
      }
      finally{
        setUploading(false)
      }
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
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <TouchableOpacity onPress={handleBackPress} disabled={uploading}>
              <Ionicons name="arrow-back" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVisible(true)} disabled={uploading}>
              <MaterialIcons name="delete-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ marginTop: 12, paddingBottom: 100 }}>
            <TextInput
              value={title}
              mode="outlined"
              multiline
              disabled={analyzing || journalData.status === 'analysisCompleted'}
              style={{ outlineWidth: 0, marginTop: 24, backgroundColor: color }}
              outlineStyle={{ borderWidth: 0 }}
              textColor="white"
              cursorColor="white"
              contentStyle={{
                fontFamily: "Fredoka-Medium",
                color: "white",
                fontSize: 32,
              }}
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
              disabled={analyzing || journalData.status === 'analysisCompleted'}
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
            <View style={{flexDirection:'column',gap:12}}>
            {photo.length > 0 &&
            photo.map((item,key)=>(
              <View key={key} style={{position:'relative'}}><Image source={{uri:item.url || item.uri}} style={{width:300,height:300,borderRadius:20,borderWidth:10,borderColor:'#fff'}}/>
            <Image source={require('../../assets/icons/tape.png')} style={{position:'absolute', top:-10,right:40,width:80,height:80}}/>
            <Button disabled={uploading} onPress={()=>handleDeletePhoto(journalId,item._id)} style={[{position:'absolute',borderRadius:20,top:15,left:12,padding:1,backgroundColor:Colors.primary, width:'auto'},uploading && {backgroundColor:'#5d5d5d'}]}>{uploading ? <ActivityIndicator size="small"/> : <FontAwesome name="close" size={16} color="#fff" />}</Button>
            </View>
            ))
            }
            </View>
          </ScrollView>
        </View>
        <View
          style={[
            {
              paddingBottom: 50,
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              backgroundColor: "#fff",
              borderTopWidth: 2,
              borderTopColor: "#ccc",
              justifyContent: "center",
            },
            globalStyle.container,
          ]}
        >
          {
            analyzing || journalData.status === 'analysisCompleted' ? 
          <Button
              style={[styles.button, { backgroundColor: color,width:'100%' }]}
              onPress={()=>showAnalysis(journalData._id)}
            >
              <Text
                style={{ fontFamily: "Fredoka-Medium", color: "#fff", gap: 12 }}
              >
                Show Analysis
              </Text>
            </Button>:
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button
              style={[styles.button, { backgroundColor:Colors.primary,width:'20%',borderRadius:50 },isListening && {backgroundColor:Colors.secondary}]}
              onPress={isListening ? stopVoice : startVoice}
              disabled={analyzing || journalData.status === 'analysisCompleted'}
            >
              <Text
                style={{ fontFamily: "Fredoka-Medium", color: "#fff", gap: 12 }}
              >{ !isListening ? 
                <FontAwesome name="microphone" size={16} color="#fff" /> :
                <MaterialCommunityIcons name="microphone-settings" size={20} color="#fff" />
}
                </Text>
            </Button>
             <Button onPress={()=>Alert.alert("Add Photo","Choose an Option",[
              {text:'Camera',onPress:takePhoto},
              {text:'Gallery',onPress:pickImage},
              {text:'Cancel'}
             ])} disabled={uploading} style={[styles.button, { backgroundColor: analyzing || journalData.status === 'analysisCompleted' ? '#5d5d5d' :Colors.primary },uploading && {backgroundColor:'#5d5d5d'}]}>
              <Text
                style={{ fontFamily: "Fredoka-Medium", color: "#fff", gap: 12 }}
              >
               Upload
               <FontAwesome name="photo" size={16} color="#fff" />
              </Text>
            </Button>
            <Button onPress={()=>analyzeAI(journalId ? journalId : journalData._id)} disabled={analyzing || journalData.status === 'analysisCompleted' || uploading} style={[styles.button, { backgroundColor: analyzing || journalData.status === 'analysisCompleted' ? '#5d5d5d' :Colors.primary },uploading && {backgroundColor:'#5d5d5d'}]}>
              <Text
                style={{ fontFamily: "Fredoka-Medium", color: "#fff", gap: 12 }}
              >
                {
                  analyzing || journalData.status == "analysisCompleted" ? "Disabled" : "Analysis"
                }
                <MaterialCommunityIcons
                  name="star-four-points"
                  size={16}
                  color="#fff"
                />
              </Text>
            </Button>
            

          </View>
}
        </View>
              
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
                fontFamily: "Fredoka-Medium",
                fontSize: 20,
                textAlign: "center",
                color: color,
              }}
            >
              Do you wanna delete your Journal ?
            </Dialog.Title>
            <Dialog.Actions
              style={{ alignContent: "center", alignSelf: "center" }}
            >
              <Button
                style={[{ backgroundColor: color }, styles.button]}
                onPress={() => handleDelete(journalId)}
              >
                <Text style={{ fontFamily: "Fredoka-Regular", color: "#fff" }}>
                  Delete
                </Text>
              </Button>
              <Button style={styles.button}>
                <Text
                  style={{ fontFamily: "Fredoka-Regular", color: color }}
                  onPress={() => setVisible(false)}
                >
                  Cancel
                </Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default JournalPage;

const styles = StyleSheet.create({
  button: {
    width: "30%",
    marginTop: 24,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 8,
  },
});