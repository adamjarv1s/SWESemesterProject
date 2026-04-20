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
import type { RootStackParamList } from '../../types';
import { useLocalSearchParams, useRouter } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccDetails'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AccDetailsScreen() {
  const navigation = useNavigation<NavProp>();
  const { accountType } = useLocalSearchParams<{ accountType: string }>();
  const router = useRouter();

  // Name States
  const [username, setUserName] = React.useState('');

  // Date Picker States (for last period start date)
  const [date, setDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);

  // Average Period Length States
  const [periodLength, setPeriodLength] = React.useState(5);

  // Average Cycle Length States
  const [cycleLength, setCycleLength] = React.useState(28);

  const compName = (averagePeriodLength: number, averageCycleLength: number) => {
    router.push(`/createProfile/comp_name?accountType=${accountType}&averagePeriodLength=${averagePeriodLength}&averageCycleLength=${averageCycleLength}`);
  }
  return (
    <ThemedView style={styles.wholeScreen}>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer]} type="title">
          Account Details
        </ThemedText>
      </View>
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Name (Max 12 Characters)</ThemedText>
      <TextInput
        value = {username}
        onChangeText={setUserName}
        style={[styles.textInput]}
        autoCapitalize="none"
        placeholder="Name" 
        placeholderTextColor="#94a3b8"
        maxLength={12}
      />
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Last Period Start Date</ThemedText>
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <Pressable 
          style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
          ]}
          onPress={() => setShowPicker(true)}>
          <ThemedText style={[styles.inlineContainer, styles.createButtonText]}>
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
          selectedValue={periodLength}
          onValueChange={(value) => setPeriodLength(value)}
        >
          {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
            <Picker.Item key={n} label={n === 1 ? "1 day" : `${n} days`} value={n} />
          ))}
        </Picker>
      </View>
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Average Cycle Length</ThemedText>
      <View style={[styles.dropDownInput, {marginTop: windowHeight * 0.01}]}>
        <Picker
          selectedValue={cycleLength}
          onValueChange={(value) => setCycleLength(value)}
        >
          {Array.from({ length: 22 }, (_, i) => i + 21).map((n) => (
            <Picker.Item key={n} label={n === 1 ? "1 day" : `${n} days`} value={n} />
          ))}
        </Picker>
      </View>

      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <ThemedText style={styles.inlineContainer}>
          <Pressable 
            style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
            ]}
            onPress={() => compName(periodLength, cycleLength)}>
              <ThemedText style={styles.createButtonText}>Continue</ThemedText>
          </Pressable>
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
  },
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
    width: "60%",
    height: "auto",
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },
  createButtonPressContainer:{
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

  createButtonText:{
    color: '#ffffff',
  },
});
