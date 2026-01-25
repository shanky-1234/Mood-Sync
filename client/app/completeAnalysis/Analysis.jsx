import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Badge } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { globalStyle } from '../Constants/globalStyles'
import { Colors } from '../Constants/styleVariable'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import MoodCoach from '../components/MoodCoach'
import { UseStoredJournalData } from '../Context/StoredJournal'
import { useStoredCheckIn } from '../Context/StoredCheckIn'
import { useLocalSearchParams } from 'expo-router'
import MoodSyncMascot from '../components/pages/MoodSyncMascot'
import checkInService from '../Service/checkin'
import journalService from '../Service/journal'

const Analysis = () => {
  const { journalResult } = UseStoredJournalData()
  const { checkInResult } = useStoredCheckIn()
  const [result, setResult] = useState(null)

  const { type, checkInId, journalId } = useLocalSearchParams()

  useEffect(() => {
    let mounted = true

    const loadAnalysis = async () => {
      // ---- FLOW VIEW (context) ----
      if (type === 'checkIn' && checkInResult) {
        setResult(checkInResult)
        return
      }

      if (type === 'journal' && journalResult) {
        setResult(journalResult)
        return
      }

      // ---- HISTORY VIEW (id) ----
      try {
        if (checkInId) {
          const res = await checkInService.getCheckInById(checkInId)
          if (mounted && res.success) {
            setResult(res.checkInData)
          }
          return
        }

        if (journalId) {
          const res = await journalService.getJournalById(journalId)
          if (mounted && res.success) {
            setResult(res.journal)
          }
        }
      } catch (err) {
        console.error('Failed to load analysis', err)
      }
    }

    loadAnalysis()

    return () => {
      mounted = false
    }
  }, [type, checkInId, journalId, checkInResult, journalResult])

  const normalized = (() => {
    if (!result) {
      return {
        moodScore: 0,
        energyScore: 0,
        stressScore: null,
        emotions: [],
        causes: [],
        solution: '',
        isJournal: false,
      }
    }

    // ---- CHECK-IN (direct or id) ----
    if (result.moodScore !== undefined) {
      return {
        moodScore: result.moodScore,
        energyScore: result.energyScore,
        stressScore: null,
        emotions: result.emotion || [],
        causes: result.causes || [],
        solution: result.analysis?.solution || '',
        isJournal: false,
      }
    }

    // ---- CHECK-IN (wrapped) ----
    if (result.checkIn || result.checkInData) {
      const data = result.checkIn || result.checkInData
      return {
        moodScore: data.moodScore,
        energyScore: data.energyScore,
        stressScore: null,
        emotions: data.emotion || [],
        causes: data.causes || [],
        solution: data.analysis?.solution || '',
        isJournal: false,
      }
    }

    // ---- JOURNAL (direct or wrapped) ----
    const journal = result.getJournal || result.journal || result

    if (journal?.analysis?.scores) {
      return {
        moodScore: journal.analysis.scores.moodScore ?? 0,
        energyScore: journal.analysis.scores.energyScore ?? 0,
        stressScore: journal.analysis.scores.stressScore ?? null,
        emotions: journal.analysis.emotion || [],
        causes: journal.analysis.causes || [],
        solution: journal.analysis.solution || '',
        isJournal: true,
      }
    }

    return {
      moodScore: 0,
      energyScore: 0,
      stressScore: null,
      emotions: [],
      causes: [],
      solution: '',
      isJournal: false,
    }
  })()

  return (
    <View style={[globalStyle.container, { backgroundColor: '#fff', flex: 1 }]}>
      <ScrollView style={{ backgroundColor: '#FFDEDC', borderRadius: 12 }}>
        <View style={{ width: 300, alignSelf: 'center' }}>
          <Image
            source={require('../../assets/icons/notedots.png')}
            style={{ width: '100%' }}
            resizeMode="contain"
          />
          <Text style={{textAlign:'center'}}></Text>
        </View>

        <View style={{ marginInline: 20, padding: 12 }}>
          <Text style={{ fontFamily: 'Fredoka-Medium', textAlign: 'center', color: Colors.primary, fontSize: 20 }}>
            This is how you felt
          </Text>

          <MoodSyncMascot
            mood={normalized.moodScore}
            energy={normalized.energyScore}
          />

          {/* EMOTIONS */}
          <View style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 16, gap: 6 }}>
            {normalized.emotions.map((item, index) => (
              <Badge key={index} style={styles.badgeStyle}>
                <Text style={{ fontFamily: 'Fredoka-Bold', color: '#fff' }}>
                  {item}
                </Text>
              </Badge>
            ))}
          </View>

          {/* SCORES */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 }}>
            <Score label="Mood Score" value={normalized.moodScore} color={Colors.primary} />
            <Score label="Energy Score" value={normalized.energyScore} color="#5E4C4B" />

            {normalized.isJournal && (
              <Score label="Stress Score" value={normalized.stressScore} color={Colors.secondary} />
            )}
          </View>

          {/* SOLUTION */}
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, marginTop: 24 }}>
            <Text style={{ fontFamily: 'JosefinSlab-SemiBold', fontSize: 16 }}>
              "{normalized.causes}"
            </Text>
          </View>

          <View style={{ marginTop: 24 }}>
            <MoodCoach solution={normalized.solution} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const Score = ({ label, value, color }) => (
  <View style={{ alignItems: 'center' }}>
    <AnimatedCircularProgress
      size={80}
      width={8}
      fill={value || 0}
      tintColor="#fff"
      backgroundWidth={12}
      rotation={0}
      backgroundColor={color}
    >
      {fill => (
        <Text style={{ fontFamily: 'Fredoka-Semibold', color }}>{fill}</Text>
      )}
    </AnimatedCircularProgress>
    <Text style={{ fontFamily: 'Fredoka-Medium', color }}>{label}</Text>
  </View>
)

export default Analysis

const styles = StyleSheet.create({
  badgeStyle: {
    paddingHorizontal: 12,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: Colors.primary,
  },
})
