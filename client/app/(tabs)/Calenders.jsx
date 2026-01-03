import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import React, { useEffect, useState } from "react";
import { globalStyle } from "../Constants/globalStyles";
import { Colors } from "../Constants/styleVariable";
import jounralService from "../Service/journal";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/slices/authSlice";
import Notes from "../components/Notes";
import CheckInCard from "../components/CheckInCard";
import checkInService from "../Service/checkin";

const CalenderManager = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [journal, setJournal] = useState([]);
  const [checkIns,setCheckIns] = useState([])
  const [date, setDate] = useState(getToday()); // Selected date

  // Get today's date in local timezone
  function getToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, "0");
    const dd = today.getDate().toString().padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // Fetch journals from API
  const getJournal = async () => {
    try {
      const response = await jounralService.getJournalofUser();
      if (response.success) {
        console.log("success");
        setJournal(response.journals);
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

    const getCheckIn = async ()=>{
      try {
        const respone = await checkInService.getCheckIn()
        if(respone.success){
          console.log('success')
          setCheckIns(respone.checkIn)
        }
      } catch (error) {
        console.error(error);
      dispatch(setLoading(false));
      }
      finally{
        dispatch(setLoading(false))
      }
    }

  useEffect(() => {
    dispatch(setLoading(true));
    getJournal();
    getCheckIn()
  }, []);

  // Convert UTC ISO string to local "YYYY-MM-DD"
  const getLocalDateOnly = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString); // JS converts to local time
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };


  const normalizeJournals = journal?.map((j)=>{
    return{
      id:j._id,
      type: "journal",
      createdAt: j.createdAt,
      data: j
    }
  })

  const normalizeCheckins = checkIns.map((c)=>{
    return{
       id:c._id,
      type: "checkin",
      createdAt: c.createdAt,
      data: c
    }
  })

const combinedData = [...normalizeCheckins,...normalizeJournals]

const filteredDate = !isLoading ? 
combinedData.filter((data)=>getLocalDateOnly(data.createdAt) === date):[]
const sortByTime = filteredDate.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
 const markedJournalDates = combinedData.reduce((acc,j)=>{
  const date = getLocalDateOnly(j.createdAt)
  const today = getToday()
  if (date === today) return acc
    acc[date] = {
    marked: true,
    dotColor: Colors.primary,   // Only dot
    customStyles: {
      text: {
        color: Colors.primary,   // Text color change
        fontWeight: "700",
      },
    },
  };
  return acc
 },{})



  const handleDate = (selectedDay) => {
    setDate(selectedDay);
    console.log("Selected date:", selectedDay);
  };



  // Format date for display
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
console.log(normalizeCheckins)
  return (
    <View style={[{ flex: 1, backgroundColor: "#FBE7E5" }, globalStyle.container]}>
      <Calendar
      markingType="custom"
        onDayPress={(day) => handleDate(day.dateString)}
        style={{ borderRadius: 8 }}
        enableSwipeMonths={true}
        hideExtraDays={true}
        markedDates={{
          [date]: {
            selected: true,
            selectedColor: Colors.secondary,
          },
          [getToday()]: {
            selected: true,
            marked: true,
            selectedColor: Colors.primary,
            customStyles: {
              borderColor: Colors.secondary,
              borderWidth: 2,
            }
          },
          ...markedJournalDates
        }}
        theme={{
          textDayFontFamily: "Fredoka-Medium",
          textMonthFontFamily: "Fredoka-Bold",
          textMonthFontSize: 20,
          todayTextColor: Colors.primary,
          textDayHeaderFontFamily: "Fredoka-Medium",
          todayButtonFontFamily: "Fredoka-Bold",
          todayBackgroundColor: Colors.primary,
          todayButtonTextColor: "#fff",
        }}
      />

      <View style={{ marginTop: 20, flex: 1 }}>
        <Text style={{ fontSize: 24, fontFamily: "Fredoka-Medium", color: Colors.primary }}>
          {date === getToday() ? "Today" : formatDate(date)}
        </Text>
       <ScrollView style={{ marginTop: 10}}>
        <View style={{flexDirection:'column',gap:8}}>
  {sortByTime.length > 0 ? (
    sortByTime.map(item => {
      if (item.type === "journal") {
        return (
          <Notes
            key={item.id}
            title={item.data.title}
            id={item.data._id}
            color={item.data.color}
            content={item.data.content}
            createdAt={item.data.updatedAt}
          />
        );
      }

      if (item.type === "checkin") {
        return (
          <CheckInCard
            key={item.id}
            moodScore={item.data.moodScore}
            time={new Date(item.createdAt).toLocaleTimeString("en-GB",{
               hour: "2-digit",
  minute: "2-digit",
            })}
          />
        );
      }

      return null;
    })
  ) : (
    <>
      <Text
        style={{
          marginTop: 10,
          color: "#555",
          fontFamily: "Fredoka-Medium",
        }}
      >
        No activity for this date
      </Text>
      
    </>
  )}
  </View>
</ScrollView>

      </View>
    </View>
  );
};

export default CalenderManager;

const styles = StyleSheet.create({});
