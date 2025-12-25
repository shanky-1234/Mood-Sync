import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { SegmentedButtons } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { globalStyle } from '../Constants/globalStyles';
import { Colors } from '../Constants/styleVariable';
import checkInService from '../Service/checkin';
import { subDays, format, isAfter } from 'date-fns';

const { width: screenWidth } = Dimensions.get('window');

const Home = () => {
  const [checkInData, setCheckInData] = useState([]);
  const [checkedValue, setCheckedValue] = useState('7D');
  const [filteredData, setFilteredData] = useState([]);

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
  const getCheckInData = async()=>{
    const response = await checkInService.getCheckIn()
    try {
      if(response.success){
      setCheckInData(response.checkIn)
      console.log('success')
    }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    getCheckInData()
  },[])

  const getStartofTheWeek = ()=>{
    const today = new Date()
    const day = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate()-day)
    start.setHours(0,0,0,0)
    return start
  }

  const buildMoodData = (checkIns) => {
  const startOfWeek = getStartofTheWeek();
  const result = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dayLabel = days[date.getDay()];

    const sameDayEntries = checkIns.filter(item => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    });

    let value = 0;

    if (sameDayEntries.length > 0) {
      const total = sameDayEntries.reduce(
        (sum, item) => sum + item.moodScore,
        0
      );
      value = Math.round(total / sameDayEntries.length);
    }

    result.push({
      value,
      label: dayLabel,
    });
  }

  return result;
};

const getDaysInCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

const buildThisMonthMoodData = (checkIns) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const daysInMonth = getDaysInCurrentMonth();

  const result = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    const sameDayEntries = checkIns.filter(item => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getDate() === day &&
        itemDate.getMonth() === month &&
        itemDate.getFullYear() === year
      );
    });

    let value = 0;

    if (sameDayEntries.length > 0) {
      const total = sameDayEntries.reduce(
        (sum, item) => sum + item.moodScore,
        0
      );
      value = Math.round(total / sameDayEntries.length);
    }

    result.push({
      value,
      label: day.toString(), // 1, 2, 3 ...
    });
  }

  return result;
};

const buildThisYearMoodData = (checkIns) => {
  const now = new Date();
  const year = now.getFullYear();
  const result = [];

  for (let month = 0; month < 12; month++) {
    const monthlyEntries = checkIns.filter(item => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getFullYear() === year &&
        itemDate.getMonth() === month
      );
    });

    let value = 0;

    if (monthlyEntries.length > 0) {
      const total = monthlyEntries.reduce(
        (sum, item) => sum + item.moodScore,
        0
      );
      value = Math.round(total / monthlyEntries.length);
    }

    result.push({
      value,
      label: months[month],
    });
  }

  return result;
};

  useEffect(() => {
  if (checkInData.length === 0) return;

  if (checkedValue === '7D') {
    const chartData = buildMoodData(checkInData);
    console.log('7D CHART DATA:', chartData);
    setFilteredData(chartData);
  }
  if(checkedValue === 'M'){
    const monthData = buildThisMonthMoodData(checkInData);
    setFilteredData(monthData)
  }

  if(checkedValue === 'Y'){
    const yearData = buildThisYearMoodData(checkInData)
    setFilteredData(yearData)
  }
}, [checkInData, checkedValue]);



  const items = [
    { label: '7 Days', value: '7D' },
    { label: 'Month', value: 'M' },
    { label: 'Year', value: 'Y' },
  ];

  const barData = [
    { value: 15,},
    { value: 30 },
    { value: 26 },
    { value: 40 },
  ];

  return (
    <View style={[globalStyle.container, { backgroundColor: '#FBE7E5', flex: 1 }]}>
      <SegmentedButtons
        style={styles.options}
        value={checkedValue}
        onValueChange={setCheckedValue}
        buttons={items.map(item => ({
          ...item,
          uncheckedColor: Colors.primary,
          checkedColor: 'white',
          style: {
            borderColor: Colors.primary,
            borderWidth: 1.5,
            fontFamily: 'Fredoka-Bold',
            backgroundColor: checkedValue === item.value ? Colors.primary : '#FCE9E7',
          },
        }))}
      />

      <View style={{ width: '100%', marginTop: 24 }}>
        <Text style={{ fontFamily: 'Fredoka-Medium', fontSize: 20, marginBottom: 16, color: Colors.primary }}>
          Mood Trends
        </Text>
        <LineChart
        data={filteredData}
          areaChart
          thickness={10}
          maxValue={100}
          noOfSections={5}
          spacing={50}
          curved
          width={300}
          yAxisThickness={2}
          xAxisThickness={2}
          yAxisTextStyle={{ fontFamily: "Fredoka-Regular" }}
          dataPointLabelWidth={10}
          dataPointsColor={Colors.primary}
          color={Colors.primary}
          startFillColor={Colors.secondary}
          endFillColor1={'rgba(255, 217, 212, 0.42)'}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  options: {
    width: 350,
    marginBottom: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
