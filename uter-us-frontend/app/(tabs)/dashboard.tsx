import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Pressable } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import { useFonts } from '@expo-google-fonts/bree-serif/useFonts';
import { BreeSerif_400Regular } from '@expo-google-fonts/bree-serif/400Regular';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


import { useEffect, useState } from 'react';
import { View } from 'react-native';

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function HomeScreen() {

  let [fontsLoaded] = useFonts({
    BreeSerif_400Regular
  });

  return (
    <ThemedView>

        {/* Top Header Bar -> Hamburger Menu, Hello [User], and Log Out 
            NOTES:
                - Need to change the icons into buttons
                    - faBars needs to open the sidebar menu
                    - faSignOutAlt needs to log out the user and return to profiles/index screen

                - Once database is set up, need to replace "name" with the active user's name */}

        <View style={[styles.inlineContainer, styles.topHeader]}>
            <FontAwesomeIcon icon={faBars} size={20}/>

            <ThemedText style={[styles.welcomeUserMessage]}>
                Hello, user!
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
        
        */}

        <View>
            <View style={[styles.dayInfoBoxContainer, styles.inlineContainer]}>
                      <View style={[styles.stepContainer]}>
                        <ThemedText style={[styles.dayInfoBoxDate]}>
                          11th
                        </ThemedText>
                        <ThemedText style={[styles.dayInfoBoxFlow]}>
                          Medium Flow
                        </ThemedText>
                      </View>

                      <ThemedText style={[styles.dayInfoBoxGeneral]}>
                        Your period is expected to start today. Past logs have indicated you experience cramps, pain, and bloating.
                      </ThemedText>
            </View>

            <Calendar style={[styles.calendarContainer]}
                onDayPress={day => {
                    console.log('selected day', day);
                }}
            />

            <Pressable
                style={({ pressed }) => [
                styles.buttonContainer,
                pressed && styles.buttonPressedContainer
                ]}
                onPress={() => alert('log period button pressed')}
            >
                <ThemedText style={[styles.buttonText]}>+ Log Period</ThemedText>
            </Pressable>
        </View>

    </ThemedView>
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
    height: windowHeight * 0.12,
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

});
