import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Pressable } from 'react-native';
import { IPAddress } from '@/config';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faGem, faFire, faStore } from '@fortawesome/free-solid-svg-icons';
import { useFonts } from '@expo-google-fonts/bree-serif/useFonts';
import { BreeSerif_400Regular } from '@expo-google-fonts/bree-serif/400Regular';

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { Modal, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { useEffect, useState, useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buildUnavailableHoursBlocks } from 'react-native-calendars/src/timeline/Packer';

// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useRouter } from 'expo-router';

import type { DrawerNavigationProp } from '@react-navigation/drawer';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { ScrollView } from 'react-native-gesture-handler';

type NavPropDrawer = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccPurpose'>;


// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const now: Date = new Date();
let dayOfMonth: number = now.getDate();
let dateValue: "";

const lastDigit: number = dayOfMonth % 10;
if (lastDigit == 1 && dayOfMonth != 11){
   dateValue = dayOfMonth + "st"
} else if (lastDigit == 2 && dayOfMonth != 12){
  dateValue = dayOfMonth + "nd"
} else if (lastDigit == 3 && dayOfMonth != 13){
  dateValue = dayOfMonth + "rd"
} else {
  dateValue = dayOfMonth + "th"
}

async function getUserName() {
  try {
    const response = await fetch(`${IPAddress}/get-user`);
    const text = await response.text();
    return text;

  } catch (error) {
    console.error('ErrorGetUsername:', error);
    return 'Unpeakawa';
  }
}

async function getPeriodData() {
  try {
    const response = await fetch(`${IPAddress}/get-period-data`);
    const json = await response.json();
    return json;

  } catch (error) {
    console.error('ErrorGetPeriodData:', error);
    return {};
  }
}

async function getStreak() {
  try {
    const response = await fetch(`${IPAddress}/update-streak`);
    const text = await response.text();
    return text;

  } catch (error) {
    console.error('ErrorUpdateStreak:', error);
    return 'STREAKNUM';
  }
}
async function getCycleAlerts() {
  try {
    const response = await fetch(`${IPAddress}/cycle-alerts`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("CycleAlertError:", error);
    return null;
  }
}

async function getDiamonds() {
  try {
    const response = await fetch(`${IPAddress}/get-diamonds`);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('ErrorGetDiamonds:', error);
    return '0';
  }
}

async function getPetId() {
  try {
    const response = await fetch(`${IPAddress}/get-pet-id`);
    const text = await response.text();
    return parseInt(text);

  } catch (error) {
    console.error('ErrorGetPetId:', error);
    return -1;
  }
}

async function getCurrentHeadwear() {
  try { 
    const response = await fetch(`${IPAddress}/get-current-headwear`);
    const text = await response.text();
    return parseInt(text);
  } catch (error) {
    console.error('ErrorGetCurrentHeadwear:', error);
    return 0;
  }
}

async function getCurrentHoldable() {
  try { 
    const response = await fetch(`${IPAddress}/get-current-holdable`);
    const text = await response.text();
    return parseInt(text);
  } catch (error) {
    console.error('ErrorGetCurrentHoldable:', error);
    return 0;
  }
}

export default function DashboardScreen() {
  const navigation = useNavigation<NavProp>();
  const DrawerNavigation = useNavigation<NavPropDrawer>();
  const router = useRouter();

  const [userName, setUserName] = useState('Loading...');
  const [periodData, setPeriodData] = useState<Record<string, any>>({});
  const [streak, setStreak] = useState('str');
  const [diamondCount, setDiamondCount] = useState('0');
  const [petId, setPetId] = useState(1);
  const [currentHeadwear, setCurrentHeadwear] = useState(0);
  const [currentHoldable, setCurrentHoldable] = useState(0);

  const [showLogModal, setShowLogModal] = useState(false);
  const [flow, setFlow] = useState(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const selectedDayData = selectedDate ? periodData[selectedDate] : null;
  const [alerts, setAlerts] = useState<any>(null);

const getDaysUntilNextPeriod = () => {
  const today = new Date();
  const entries = Object.entries(periodData);
  const nextPredicted = entries
    .filter(([date, data]: [string, any]) => data.predicted && data.customStyles?.container?.startingDay)
    .map(([date]) => new Date(date))
    .filter(d => d > today)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  if (!nextPredicted) return null;
  const diff = Math.ceil((nextPredicted.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};
  
  const flowOptions = [
    { label: 'None', value: 0 },
    { label: 'Light', value: 1 },
    { label: 'Medium', value: 2 },
    { label: 'Heavy', value: 3 },
  ];

  const getFlowLabel = (value?: number) => {
  if (value === 3) return 'Heavy Flow';
  if (value === 2) return 'Medium Flow';
  if (value === 1) return 'Light Flow';
  return 'No Flow Recorded';
};

const markedDates = Object.fromEntries(
  Object.entries(periodData).map(([date, data]: [string, any]) => {
    const isSelected = date === selectedDate;
    return [
      date,
      {
        ...data,
        customStyles: {
          ...data.customStyles,
          container: {
            ...data.customStyles?.container,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? '#ff69b4' : 'transparent',
          },
        },
      },
    ];
  })
);

if (selectedDate && !periodData[selectedDate]) {
  markedDates[selectedDate] = {
    customStyles: {
      container: {
        borderWidth: 2,
        borderColor: '#ff69b4',
        borderRadius: 6,
      },
      text: { color: '#000' },
    },
  };
}

  let [fontsLoaded] = useFonts({
    BreeSerif_400Regular
  });

useEffect(() => {
  getUserName().then(name => setUserName(name));
  getPeriodData().then(data => setPeriodData(data));
  getStreak().then(name => setStreak(name));
  getCycleAlerts().then(data => {
    console.log("RAW ALERTS:", data);
    setAlerts(data);
  });
  getDiamonds().then(diamonds => setDiamondCount(diamonds));
  getPetId().then(id => setPetId(id));
}, []);
  
useFocusEffect(
  useCallback(() => {
    getCurrentHeadwear().then(headwear => setCurrentHeadwear(headwear));
    getCurrentHoldable().then(holdable => setCurrentHoldable(holdable));
    getDiamonds().then(diamonds => setDiamondCount(diamonds));
  }, [])
);

  if (!fontsLoaded) {
    return null;
  }

let alertMessage = "Loading alerts...";

if (alerts) {
  const daysUntil = getDaysUntilNextPeriod();
  const namePrefix = alerts.accountType === 1 && alerts.childName
    ? `${alerts.childName}'s `
    : '';

  if (selectedDayData?.description && selectedDayData.description.trim() !== '') {
    alertMessage = selectedDayData.description;
  } else {
    switch (true) {
      case alerts.missed:
        alertMessage = `${namePrefix}period may have been missed.`;
        break;
      case alerts.fertility:
        alertMessage = `${namePrefix}fertile window is now.`;
        break;
      case alerts.irregular:
        alertMessage = `${namePrefix}cycle may be irregular.`;
        break;
      case daysUntil !== null && daysUntil <= 5:
        alertMessage = `${namePrefix}period expected in ${daysUntil} day${daysUntil === 1 ? '' : 's'}.`;
        break;
      default:
        alertMessage = daysUntil !== null
          ? `Next ${namePrefix}period expected in ${daysUntil} days.`
          : "Everything looks normal.";
    }
  }
}

  const toBuddy = () => {
    router.push("./buddy");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
  <ThemedView style={{ flex: 1 , backgroundColor: '#FAFAFA'}}>

        {/* Top Header Bar -> Hamburger Menu, Hello [User], and Log Out 
            NOTES:
                - Need to change the icons into buttons
                    - faBars needs to open the sidebar menu
                    - faSignOutAlt needs to log out the user and return to profiles/index screen

                - Once database is set up, need to replace "name" with the active user's name */}

        <View style={[styles.inlineContainer, styles.topHeader]}>
            <Pressable onPress={() => DrawerNavigation.openDrawer()}>
              <FontAwesomeIcon icon={faBars} size={20}/>
            </Pressable>

            <ThemedText style={[styles.welcomeUserMessage, styles.blackText]}>
                Hello, {userName}!
            </ThemedText>

          <Pressable onPress={() => router.push("../createProfile/select_profile")}>
            <FontAwesomeIcon icon={faSignOutAlt} size={20} />
          </Pressable>
        </View>
          
          
        
        {/* Buddy System -> Gems, Streak, Buddy Image, Shop/Buddy Settings */}
        <View style={[styles.buddyContainer]}>
          <View style={[styles.stepContainer, {alignItems: 'center'}]}>
            <View style={[styles.inlineContainer, styles.infoContainers]}>
              <View style={[styles.inlineContainer]}>
                <ThemedText style={[styles.infoContainer, styles.blackText]}>
                  {streak} <FontAwesomeIcon size={10} icon={faFire}/>
                </ThemedText>
              
                <ThemedText style={[styles.infoContainer, styles.blackText]}>
                  {diamondCount} <FontAwesomeIcon size={10} icon={faGem}/>
                </ThemedText>

              </View>

            <Pressable 
              style={[styles.buttonShopContainer]}
              onPress={toBuddy}>
                <FontAwesomeIcon size={20} color='#ffffff' icon={faStore}/>
            </Pressable>
            </View>


            <View style={[styles.container]}>
              <View style={[styles.buddy]}>
                {petId === 1 && <Image source={require('../../assets/images/chiiwawa.png')} style={[styles.image]} />}
                {petId === 2 && <Image source={require('../../assets/images/shadow.png')} style={[styles.image]} />}
                {petId === 3 && <Image source={require('../../assets/images/birb.png')} style={[styles.image]} />}
                {petId !== 1 && petId !== 2 && petId !== 3 && <ThemedText>buddy err</ThemedText>}
              </View>

              <View style={[styles.overlayHand]}>
                {currentHoldable === 4 && <Image source={require('../../assets/images/hotWaterPack.png')} style={[styles.image]} />}
                {currentHoldable === 5 && <Image source={require('../../assets/images/candy.png')} style={[styles.image]} />}
                {currentHoldable !== 4 && currentHoldable !== 5 && <ThemedText></ThemedText>}
              </View>

              <View style={[styles.overlayHead]}>
                {currentHeadwear === 1 && <Image source={require('../../assets/images/flower.png')} style={[styles.image]} />}
                {currentHeadwear === 2 && <Image source={require('../../assets/images/crown.png')} style={[styles.image]} />}
                {currentHeadwear === 3 && <Image source={require('../../assets/images/bow.png')} style={[styles.image]} />}
                {currentHeadwear !== 1 && currentHeadwear !== 2 && currentHeadwear !== 3 && <ThemedText></ThemedText>}
              </View>
            </View>

            {/* <View style={[styles.buddyPNG]}>
                {petId === 1 && <Image source={require('../../assets/images/chiiwawa.png')} style={[styles.image]} />}
                {petId === 2 && <Image source={require('../../assets/images/shadow.png')} style={[styles.image]} />}
                {petId === 3 && <Image source={require('../../assets/images/birb.png')} style={[styles.image]} />}
                {petId !== 1 && petId !== 2 && petId !== 3 && <ThemedText>buddy</ThemedText>}
            </View> */}
          </View>
        </View>

        {/* Calendar System -> Day Information Box, Calendar, and + Log Period Button 
            NOTES:
                - Calendar documentation: https://wix.github.io/react-native-calendars/docs/Intro
                ---> Need to figure out how to customize the calendar to fit our needs (believe this is Abby's task?)
                ---> Connecting calendar to Day information box? to display the day + flow info + recorded symptoms

                - Log Period Button will open a form to log information for the day the user has selected
                ---> Heavy/Medium/Light Flow
                ---> Symptoms

                - Day Information Box will display information for the selected day
                ---> Default selection will be the current day
                ---> Will display the DAY SELECTED, FLOW LEVEL, and SYMPTOMS RECORDED if it's a period day with information logged
                ---> Display !!! and NUMBER OF DAYS BEFORE NEXT PERIOD (+ possibly expected symptoms) if it's not a period day.

                ==========================

                As a note: I was reading the Text component documentation on the React Native docs (https://reactnative.dev/docs/text)
                and came across this example text I think we could probably use to render out the user recorded symptoms?

                """ (from the documentation)
                Assuming that MyAppText is a component that only renders out its children into a Text component with styling, then MyAppHeaderText can be defined as follows:
                tsx

                const MyAppHeaderText = ({children}) => {
                  return (
                    <MyAppText>
                      <Text style={{fontSize: 20}}>{children}</Text>
                    </MyAppText>
                  );
                };
                """

                I'm thinking each "child" here is a symptom the user has recorded.
        */}
        <View>
            <View style={[styles.dayInfoBoxContainer, styles.inlineContainer]}>
                      <View style={[styles.stepContainer]}>
                        <ThemedText style={[styles.dayInfoBoxDate, styles.blackText]}>
                          {dateValue}
                        </ThemedText>
                        <ThemedText style={[styles.dayInfoBoxFlow, styles.blackText]}>
                          {selectedDayData?.heaviness
                            ? getFlowLabel(selectedDayData.heaviness)
                            : 'No Flow Recorded'}
                        </ThemedText>
                      </View>

              <ThemedText numberOfLines={4} style={[styles.dayInfoBoxGeneral, styles.blackText]}>
                {alertMessage}
              </ThemedText>
            </View>

            <Calendar
              style={[styles.calendarContainer]}
              markedDates={markedDates}
              markingType={'custom'}
              onDayPress={day => {
                setSelectedDate(day.dateString);
                const dayData = periodData[day.dateString];
                if (dayData) {
                  setFlow(dayData.heaviness ?? null);
                  setSymptoms(dayData.description ?? '');
                } else {
                  setFlow(null);
                  setSymptoms('');
                }
              }}
            />
            

            <Pressable
              disabled={!selectedDate}
              style={({ pressed }) => [
                styles.buttonContainer,
                pressed && styles.buttonPressedContainer,
                !selectedDate && { opacity: 0.4 }
              ]}
              onPress={() => setShowLogModal(true)}
            >
              <ThemedText style={styles.buttonText}>+ Log Period</ThemedText>
            </Pressable>

            <Modal
              visible={showLogModal}
              transparent={true}
              animationType="fade"
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <ThemedText style={styles.modalTitle}>Log Information</ThemedText>
                    <ThemedText style={styles.label}>Flow</ThemedText>
                    <Dropdown
                      style={styles.dropdown}
                      data={flowOptions}
                      labelField="label"
                      valueField="value"
                      placeholder="Select flow level"
                      value={flow}
                      onChange={item => {
                        setFlow(item.value);
                      }
                    }
                    />

                    <ThemedText style={styles.label}>Symptoms</ThemedText>
                      <TextInput
                        value={symptoms}
                        onChangeText={setSymptoms}
                        style={{
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 5,
                          padding: 10,
                          marginTop: 10
                        }}
                        placeholder="Cramps..."
                      />

                      <Pressable
                        style={styles.saveButton}
                        onPress={async () => {
                          if (!selectedDate) {
                            Alert.alert('Error', 'Please select a date');
                            return;
                          }
                          if (flow == null) {
                            Alert.alert('Error', 'Please select flow level');
                            return;
                          }

                          try {
                            if (flow === 0) {
                              await fetch(`${IPAddress}/delete-period-day`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ currentDate: selectedDate }),
                              });
                            } else {
                              await fetch(`${IPAddress}/log-period`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  currentDate: selectedDate,
                                  heaviness: flow,
                                  lastDay: false,
                                  description: symptoms || '',
                                }),
                              });
                            }

                            const updatedPeriodData = await getPeriodData();
                            setPeriodData(updatedPeriodData);
                            getCycleAlerts().then(data => setAlerts(data));
                            setShowLogModal(false);
                            setSymptoms('');
                            setFlow(null);
                            getDiamonds().then(diamonds => setDiamondCount(diamonds));

                          } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Could not connect to server');
                          }
                        }}
                      >
                        <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
                          Save
                        </ThemedText>
                      </Pressable>

                    </View>
                </View>
            </Modal>
        </View>

    </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

  // Grace's Added Styles

  topHeader: {
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.05,
    marginBottom: windowHeight * 0.02,
    justifyContent: 'space-between',
    //backgroundColor: '#A1CEDC',
  },

  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
  },

  welcomeUserMessage: {
    fontSize: 20,
    fontFamily: "BreeSerif_400Regular",
  },

  buddyContainer: {
    backgroundColor: '#e5ffbf',
    height: windowHeight * 0.25,
    paddingLeft: windowWidth * 0.03,
    paddingRight: windowWidth * 0.03,
    paddingTop: windowHeight * 0.007,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    marginBottom: windowHeight * 0.02,
    overflow: 'hidden',
  },

  dayInfoBoxContainer: {
    borderBlockColor: '#000000',
    borderWidth: 1,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    justifyContent: 'space-evenly',
    paddingTop: windowHeight * 0.02,
  },

  dayInfoBoxDate: {
    fontSize: 40,
    fontFamily: "BreeSerif_400Regular",
    textAlign: 'right',
    height: windowHeight * 0.035,
  },

  dayInfoBoxFlow:{
    fontWeight: 'bold',
    fontSize: 14,
  },

  dayInfoBoxGeneral: {
    fontSize: 12,
    paddingBottom: windowHeight * 0.02,
    width: windowWidth * 0.56,
    lineHeight: 18,
    //backgroundColor: '#f5f5f5',
  },

  calendarContainer: {
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
  },

  buttonContainer: {
    padding: 10,
    borderRadius: 5,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },

  buttonText: {
    color: '#F5F5F5',
  },

  buttonPressedContainer: {
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(206, 206, 206, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  label:{
    fontSize: 14,
    color: '#000000',
    marginTop: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
  backgroundColor: '#2C2C2C',
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 15,
  textAlign: 'center',
},

  infoContainers:{
    justifyContent: "space-between",
  },

  infoContainer:{
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 13,
    alignItems: 'center',
    color: '#000000',
  },

  buddyPNG: {
    alignContent: 'center',
    verticalAlign: 'top',
    marginTop: -windowHeight * 0.03,
  },

  buttonShopContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },

  buttonShopPressedContainer: {
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },

  image: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.2,
    resizeMode: 'contain',
  },

  container: {
    position: 'relative',
    marginTop: -windowHeight * 0.03,
  },

  buddy:{
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  overlayHand:{
    position: 'absolute',
    resizeMode: 'contain',
  },

  overlayHead:{
    position: 'absolute',
    resizeMode: 'contain',
  },

  blackText:{
    color: '#000000',
  },
});