import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SegmentedButtons } from 'react-native-paper'
import { Colors } from '../Constants/styleVariable';

const MultiSelectOptions = ({ items, limit, onChange, value }) => {
  const handleChange = (newValue) => {
    if (newValue.length > limit){

    };
    onChange && onChange(newValue);
    
  };

  return (
    <SegmentedButtons
      style={styles.options}
      multiSelect
      value={value}
      onValueChange={handleChange}
      buttons={items.map((item) => ({
    ...item,
    uncheckedColor:Colors.primary,
    checkedColor:'white',
    style: {
      borderColor: Colors.primary,
      borderWidth: 1.5, 
      fontFamily:'Fredoka-Bold',
       backgroundColor: value?.includes(item.value) ? Colors.primary : '#FCE9E7' 
            
    }
  }))}
      
    />
  );
};

export default MultiSelectOptions

const styles = StyleSheet.create({ options: {
    width: 350,
    marginBottom: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },})