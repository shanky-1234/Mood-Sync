import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import { Button, Dialog, PaperProvider, Portal } from 'react-native-paper'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Swipeable } from 'react-native-gesture-handler'
import jounralService from '../Service/journal'
import Notes from '../components/Notes'

const MyJournals = () => {
  const [journals, setJournals] = useState([])
  const [selectedJournalId, setSelectedJournalId] = useState(null)
  const [visible, setVisible] = useState(false)

  useFocusEffect(
    useCallback(() => {
      getAllJournal()
    }, [])
  )

  const getAllJournal = async () => {
    try {
      const response = await jounralService.getJournalofUser()

      if (response?.success) {
        console.log('Fetched journals:', response.journals)
        setJournals(response.journals || [])
      }
    } catch (error) {
      console.error('Error fetching journals:', error)
    }
  }

  const askDelete = (id) => {
    console.log('Selected journal id for delete:', id)

    if (!id) {
      console.log('No ID found')
      return
    }

    setSelectedJournalId(id)
    setVisible(true)
  }

  const handleDelete = async () => {
    try {
      console.log('Deleting journal with id:', selectedJournalId)

      if (!selectedJournalId) {
        console.log('Delete blocked: no journal id')
        return
      }

      const response = await jounralService.deleteJournal(selectedJournalId)

      if (response?.success) {
        setVisible(false)
        setSelectedJournalId(null)
        getAllJournal()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const renderRight = (id) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            borderColor: Colors.primary,
            padding: 16,
            borderWidth: 2,
            borderRadius: 100,
          }}
          onPress={() => askDelete(id)}
        >
          <MaterialIcons
            name="delete-outline"
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <PaperProvider>
      <View style={{ backgroundColor: '#FBE7E5', flex: 1 }}>
        <View style={styles.journalPaper}>
          <Image
            source={require('../../assets/icons/noteRing.png')}
            style={{ alignSelf: 'center', position: 'absolute', top: -10 }}
          />

          <ScrollView style={[globalStyle.container, { flex: 1 }]}>
            {journals.length > 0 ? (
              <View>
                {journals.map((item) => {
                  console.log(item._id)
                  return(
                  <Swipeable
                    key={item._id || item.id}
                    renderRightActions={() => renderRight(item._id || item.id)}
                  >
                    <Notes
                      title={item.title}
                      id={item._id || item.id}
                      color={item.color}
                      content={item?.content}
                      createdAt={item.updatedAt}
                    />
                  </Swipeable>)
})}
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Image
                  style={{ width: 300, height: 300 }}
                  resizeMode="contain"
                  source={require('../../assets/mascot/notfound.png')}
                />
                <Text
                  style={{
                    fontFamily: 'Fredoka-Bold',
                    fontSize: 32,
                    color: Colors.primary,
                    marginTop: -40,
                  }}
                >
                  Journals are Empty
                </Text>
                <Text style={{ fontFamily: 'JosefinSlab-Bold', fontSize: 20 }}>
                  Start writing a journal
                </Text>
                <Button style={styles.button}>
                  <Text
                    style={{ color: '#fff', fontFamily: 'Fredoka-Medium' }}
                  >
                    Write a Journal
                  </Text>
                </Button>
              </View>
            )}
          </ScrollView>
        </View>

        <Portal>
          <Dialog
            visible={visible}
            onDismiss={() => {
              setVisible(false)
              setSelectedJournalId(null)
            }}
          >
            <Image
              source={require('../../assets/mascot/dialouge.png')}
              resizeMode="contain"
              style={{
                width: 100,
                height: 100,
                justifyContent: 'center',
                alignSelf: 'center',
                alignContent: 'center',
              }}
            />

            <Dialog.Title
              style={{
                fontFamily: 'Fredoka-Medium',
                fontSize: 20,
                textAlign: 'center',
                color: Colors.primary,
              }}
            >
              Do you wanna delete your Journal?
            </Dialog.Title>

            <Dialog.Actions
              style={{ alignContent: 'center', alignSelf: 'center' }}
            >
              <Button
                style={[{ backgroundColor: Colors.primary }, styles.button]}
                onPress={handleDelete}
              >
                <Text style={{ fontFamily: 'Fredoka-Regular', color: '#fff' }}>
                  Delete
                </Text>
              </Button>

              <Button
                style={styles.button}
                onPress={() => {
                  setVisible(false)
                  setSelectedJournalId(null)
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Fredoka-Regular',
                    color: Colors.primary,
                  }}
                >
                  Cancel
                </Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  )
}

export default MyJournals

const styles = StyleSheet.create({
  journalPaper: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 28,
    borderTopColor: '#B7B2B2',
    borderTopWidth: 2,
    position: 'relative',
    paddingTop: 24,
  },
  note: {
    padding: 16,
    borderRadius: 12,
    position: 'relative',
    zIndex: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  button: {
    width: '30%',
    marginTop: 24,
    borderRadius: 8,
    height: 56,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 8,
    color: '#fff',
  },
})