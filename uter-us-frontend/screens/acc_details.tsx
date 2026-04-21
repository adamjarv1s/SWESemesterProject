import React from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable, Text, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccDetails'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AccDetailsScreen() {
  const navigation = useNavigation<NavProp>();

  // Name States
  const [username, setUserName] = React.useState('');

  // Date Picker States (for last period start date)
  const [date, setDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);

  // Average Period Length States
  const [periodLength, setPeriodLength] = React.useState(5);

  // Average Cycle Length States
  const [cycleLength, setCycleLength] = React.useState(28);

  const compName = () => {
    navigation.navigate("CompName");
  }
  return (
    <ThemedView>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer]} type="header">
          Account Details
        </ThemedText>
      </View>
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Name (Max 12 Characters)</ThemedText>
      <TextInput
        // value = {username} onChangeText={setUserName}
        style={[styles.textInput]}
        autoCapitalize="none"
        placeholder="Name" 
        placeholderTextColor="#94a3b8"
        maxLength={12}
      />
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Last Period Start Date</ThemedText>
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <Pressable 
          //selectedValue={periodDate}
          //onValueChange={(value) => setPeriodDate(value)}
          style={({ pressed }) => [
          styles.createButtonContainer,
          pressed && styles.createButtonPressContainer
          ]}
          onPress={() => setShowPicker(true)}>
          <ThemedText style={styles.inlineContainer}>
            {date.toDateString()}
          </ThemedText>
        </Pressable>
      </View>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event.type === "dismissed") return;
            if (selectedDate) {
              setDate(selectedDate);
            }
            setShowPicker(false);
          }}
        />
      )}

      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Average Period Length</ThemedText>
      <View style={[styles.dropDownInput, {marginTop: windowHeight * 0.01}]}>
        <Picker
          //selectedValue={periodLength}
          //onValueChange={(value) => setPeriodLength(value)}
        >
          <Picker.Item label="1 day" value={1} />
          <Picker.Item label="2 days" value={2} />
          <Picker.Item label="3 days" value={3} />
          <Picker.Item label="4 days" value={4} />
          <Picker.Item label="5 days" value={5} />
          <Picker.Item label="6 days" value={6} />
          <Picker.Item label="7 days" value={7} />
          <Picker.Item label="8 days" value={8} />
          <Picker.Item label="9 days" value={9} />
          <Picker.Item label="10 days" value={10} />
          <Picker.Item label="11 days" value={11} />
          <Picker.Item label="12 days" value={12} />
          <Picker.Item label="13 days" value={13} />
          <Picker.Item label="14 days" value={14} />
        </Picker>
      </View>
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Average Cycle Length</ThemedText>
      <View style={[styles.dropDownInput, {marginTop: windowHeight * 0.01}]}>
        <Picker
          //selectedValue={cycleLength}
          //onValueChange={(value) => setCycleLength(value)}
        >
          <Picker.Item label="21 days" value={21} />
          <Picker.Item label="22 days" value={22} />
          <Picker.Item label="23 days" value={23} />
          <Picker.Item label="24 days" value={24} />
          <Picker.Item label="25 days" value={25} />
          <Picker.Item label="26 days" value={26} />
          <Picker.Item label="27 days" value={27} />
          <Picker.Item label="28 days" value={28} />
          <Picker.Item label="29 days" value={29} />
          <Picker.Item label="30 days" value={30} />
          <Picker.Item label="31 days" value={31} />
          <Picker.Item label="32 days" value={32} />
          <Picker.Item label="33 days" value={33} />
          <Picker.Item label="34 days" value={34} />
          <Picker.Item label="35 days" value={35} />
          <Picker.Item label="36 days" value={36} />
          <Picker.Item label="37 days" value={37} />
          <Picker.Item label="38 days" value={38} />
          <Picker.Item label="39 days" value={39} />
          <Picker.Item label="40 days" value={40} />
          <Picker.Item label="41 days" value={41} />
          <Picker.Item label="42 days" value={42} />
        </Picker>
      </View>

      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <ThemedText style={styles.inlineContainer}>
          <Pressable 
            style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
            ]}
            onPress={compName}>
              Continue
          </Pressable>
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  topHeader: {
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.10,
    marginBottom: windowHeight * 0.05,
    //backgroundColor: '#A1CEDC',
  },
  bodySpacing:{
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.005,
    marginBottom: windowHeight * 0.005,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontFamily: "BreeSerif_400Regular",
  },
  createButtonContainer:{
    padding: 10,
    borderRadius: 5,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },
  createButtonPressContainer:{
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },
  textInput:{
    marginLeft: windowWidth * 0.05,
    height: 45,
    width: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontFamily: "BreeSerif_400Regular",
  },
  dropDownInput:{
    marginLeft: windowWidth * 0.05,
    width: "12%",
    fontFamily: "BreeSerif_400Regular",
    marginBottom: windowHeight * 0.005,
  },
});
