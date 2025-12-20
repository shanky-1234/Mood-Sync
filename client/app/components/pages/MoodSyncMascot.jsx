import { StyleSheet, Text, View,Image } from 'react-native'
import { Colors } from '../../Constants/styleVariable'
import React from 'react'
import { getMoodState } from '../../utils/getMoodState'

const MoodSyncMascot = ({mood,energy}) => {
    const moodState = getMoodState(mood,energy)
  return (
    <>
    <Image
                  source={moodState.image}
                  resizeMode="contain"
                  style={{ justifyContent: "center", alignSelf: "center" }}
                  width={200}
                  height={200}
                />
                <View style={{ gap: 4, marginTop: 12 }}>
                  <Text
                    style={{
                      fontFamily: "Fredoka-Regular",
                      fontSize: 20,
                      textAlign: "center",
                      color: Colors.secondary,
                    }}
                  >
                    Youre Feeling
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Fredoka-Bold",
                      fontSize: 28,
                      textAlign: "center",
                      color: Colors.primary,
                    }}
                  >
                    {moodState.label}
                  </Text>
                </View>
        </>
  )
}

export default MoodSyncMascot

const styles = StyleSheet.create({})