import React from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable } from 'react-native';
<<<<<<< HEAD:uter-us-frontend/app/(tabs)/index.tsx
import { IPAddress } from '@/config';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
=======
>>>>>>> 1ff3fea1d09e38b4d2d7589eac1b8312b35a2ecf:uter-us-frontend/app/index.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// React Navigation
import { Link, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { useRouter } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Profiles'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

<<<<<<< HEAD:uter-us-frontend/app/(tabs)/index.tsx

async function HandleCreateProfile() {
  try {
    const response = await fetch('http://localhost:8080/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Jared', pet: 'Shadow', accountType: 1, averagePeriodLength: 5 }), 
    });

    if (response.ok) {
      Alert.alert('Success', 'Profile created!');
    } else {
      Alert.alert('Error', 'Failed to create profile');
    }
  } catch (error) {
    Alert.alert('Error', 'Could not connect to server');
  }
}
=======
export default function Index() {
  const navigation = useNavigation<NavProp>();
  const router = useRouter();
>>>>>>> 1ff3fea1d09e38b4d2d7589eac1b8312b35a2ecf:uter-us-frontend/app/index.tsx

  const newProfile = () => {
    router.push("/createProfile/acc_purpose");
  };

  return (
    <ThemedView style={styles.wholeScreen}>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer]} type="title">
          UterUs
        </ThemedText>
      </View>
      <View style={[styles.inlineContainer, styles.bodySpacing]}>
        <ThemedText style={styles.inlineContainer} type="subtitle">Welcome!</ThemedText>
      </View>
      <View style={[styles.inlineContainer]}>
        <ThemedText style={styles.inlineContainer} type="default">Create a Profile to Get Started!</ThemedText>
      </View>
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
<<<<<<< HEAD:uter-us-frontend/app/(tabs)/index.tsx
          <Pressable 
=======
        <Pressable 
>>>>>>> 1ff3fea1d09e38b4d2d7589eac1b8312b35a2ecf:uter-us-frontend/app/index.tsx
          style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
          ]}
<<<<<<< HEAD:uter-us-frontend/app/(tabs)/index.tsx
          onPress={HandleCreateProfile}>
            + Create a Profile
          </Pressable>
=======
          onPress={newProfile}>
          <ThemedText style={styles.createButtonText}>+ Create Profile</ThemedText>
        </Pressable>
>>>>>>> 1ff3fea1d09e38b4d2d7589eac1b8312b35a2ecf:uter-us-frontend/app/index.tsx
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    paddingTop: windowHeight * 0.15,
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
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 5,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    textAlign: 'center',
  },
  createButtonPressContainer:{
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },

  createButtonText:{
    color: '#ffffff',
  },
});
