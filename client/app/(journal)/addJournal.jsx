import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { globalStyle } from "../Constants/globalStyles";
import { Button, TextInput } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "../Constants/styleVariable";
import { FlatList } from "react-native";
import jounralService from "../Service/journal";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/slices/authSlice";

const addJournal = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.auth);
  const router = useRouter()
  const [selected, setSelected] = useState("#DE4742");
  const [title,setTitle] = useState('')
  const color = [
    { id: 1, color: "#DE4742", name: "red" },
    { id: 2, color: "#00A8DE", name: "blue" },
    { id: 3, color: "#9B5DE5", name: "purple" },
    { id: 4, color: "#795523", name: "brown" },
  ];

  const createJournal = async () =>{
     if(!title.trim()){
        console.log('Title Empty')
        return
     }
     console.log(selected)
     console.log(title)
     dispatch(setLoading(true))
    try {
      const data = await jounralService.createJournal(title,selected)
      if(data.success){
        router.push({
          pathname: 'journalPage',
          params: {
            journalId: data.newJournal._id,
            title:data.newJournal.title,
            color:data.newJournal.color
          }
        });
      }
    } catch (error) {
       console.error(error)
    }
    finally{
      dispatch(setLoading(false))
    }
  }
  return (
    <View
      style={[globalStyle.container, { backgroundColor: "#FCE9E7", flex: 1 }]}
    >
      <TextInput
        mode="outlined"
        style={styles.input}
        value={title}
        onChangeText={(title)=>setTitle(title)}
        outlineColor="transparent"
        left={<TextInput.Icon icon="format-title" color="#A29999" />}
        placeholder="Enter the Title of Journal"
        placeholderTextColor={"#A29999"}
        contentStyle={{
          fontFamily: "Fredoka-Regular",
        }}
      />
      <View style={{ marginTop: 28 }}>
        <Text
          style={{
            fontFamily: "Fredoka-Medium",
            fontSize: 20,
            color: Colors.primary,
          }}
        >
          Pick Journal Color
        </Text>
        <View style>
          <FlatList
            data={color}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
              marginTop: 12,
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: item.color,
                    borderRadius: 200,
                    width: 60,
                    height: 60,
                    position: "relative",
                  }}
                  onPress={() => setSelected(item.color)}
                >
                  {selected === item.color && (
                    <View
                      style={[
                        styles.checkmarkContainer,
                        { borderColor: item.color },
                      ]}
                    >
                      <Text style={[styles.checkmark, { color: item.color }]}>
                        ✓
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <Button
          mode="contained"
          style={[styles.button]}
          labelStyle={{ fontFamily: "Fredoka-Regular" }
        }
        onPress={createJournal}
        >
          <Text style={{ fontFamily: "Fredoka-Regular", color: "#fff" }}>
            Create Journal
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default addJournal;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  checkmarkContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "bold",
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
});
