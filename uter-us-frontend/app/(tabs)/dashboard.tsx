import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Pressable } from 'react-native';
import { IPAddress } from '@/config';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import { useFonts } from '@expo-google-fonts/bree-serif/useFonts';
import { BreeSerif_400Regular } from '@expo-google-fonts/bree-serif/400Regular';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { Modal, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TouchableWithoutFeedback } from 'react-native';

import { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { buildUnavailableHoursBlocks } from 'react-native-calendars/src/timeline/Packer';

// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { RootStackParamList } from '../../types';

type NavProp = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;

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

export default function DashboardScreen() {
  const navigation = useNavigation<NavProp>();

  const [userName, setUserName] = useState('Loading...');
  const [periodData, setPeriodData] = useState<Record<string, any>>({});

  const [showLogModal, setShowLogModal] = useState(false);
  const [flow, setFlow] = useState(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const selectedDayData = selectedDate ? periodData[selectedDate] : null;

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

  const markedDates = {
  ...periodData,

  ...(selectedDate && {
    [selectedDate]: {
      ...(periodData[selectedDate] || {}),

      selected: true,
      selectedColor: '#ff69b4',
    },
  }),
};

  let [fontsLoaded] = useFonts({
    BreeSerif_400Regular
  });

  useEffect(() => {
    getUserName().then(name => setUserName(name));
    getPeriodData().then(data => setPeriodData(data));
  }, []);
  

  if (!fontsLoaded) {
    return null;
  }


  return (
    <ThemedView style={styles.wholeScreen}>

        {/* Top Header Bar -> Hamburger Menu, Hello [User], and Log Out 
            NOTES:
                - Need to change the icons into buttons
                    - faBars needs to open the sidebar menu
                    - faSignOutAlt needs to log out the user and return to profiles/index screen

                - Once database is set up, need to replace "name" with the active user's name */}

        <View style={[styles.inlineContainer, styles.topHeader]}>
            <Pressable onPress={() => navigation.openDrawer()}>
              <FontAwesomeIcon icon={faBars} size={20}/>
            </Pressable>

            <ThemedText style={[styles.welcomeUserMessage]}>
                Hello, {userName}!
            </ThemedText>

            <FontAwesomeIcon icon={faSignOutAlt} size={20}/>
        </View>
          
        
        {/* Buddy System -> Gems, Streak, Buddy Image, Shop/Buddy Settings */}
        <View style={[styles.buddyContainer]}>
            <ThemedText style={[]}>
                buddy system
            </ThemedText>
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
                        <ThemedText style={[styles.dayInfoBoxDate]}>
                          {dateValue}
                        </ThemedText>
                        <ThemedText style={styles.dayInfoBoxFlow}>
                          {selectedDayData?.heaviness
                            ? getFlowLabel(selectedDayData.heaviness)
                            : 'No Flow Recorded'}
                        </ThemedText>
                      </View>

              <ThemedText
                numberOfLines={4}
                style={styles.dayInfoBoxGeneral}
              >
                {selectedDayData?.description
                  ? selectedDayData.description
                  : "This would be an alert. Select a day to see period details."}
              </ThemedText>
            </View>

            <Calendar
              style={[styles.calendarContainer]}
              markedDates={markedDates}
              markingType={'custom'}
              onDayPress={day => {
                setSelectedDate(day.dateString);
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

                          if (!flow) {
                            Alert.alert('Error', 'Please select flow level');
                            return;
                          }

                          try {
                            await fetch(`${IPAddress}/log-period`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                currentDate: selectedDate,
                                startDate: selectedDate,
                                heaviness: flow,
                                lastDay: false,
                                description: symptoms || '',
                            }),
                            });

                            const updatedPeriodData = await getPeriodData();
                            setPeriodData(updatedPeriodData);

                            setShowLogModal(false);
                            setSymptoms('');

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

            <Pressable
                style={({ pressed }) => [
                styles.buttonContainer,
                pressed && styles.buttonPressedContainer
                ]}
                onPress={() => alert('settings page will be opened in the future!')}
            >
                <ThemedText style={[styles.buttonText]}>Settings</ThemedText>
            </Pressable>
        </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
  },

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
    height: windowHeight * 0.23,
    paddingLeft: windowWidth * 0.03,
    paddingRight: windowWidth * 0.03,
    paddingTop: windowHeight * 0.007,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    marginBottom: windowHeight * 0.02,
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
});
