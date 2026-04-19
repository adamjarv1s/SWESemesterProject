import React, {useState, useEffect} from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable } from 'react-native';
import { IPAddress } from '@/config';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// React Navigation
<<<<<<<< HEAD:uter-us-frontend/screens/comp_name.tsx
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CompName'>;
========
import { Link, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { useRouter } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Profiles'>;
>>>>>>>> 5b3b9af82316ed0cecfd62c79054725f10808041:uter-us-frontend/app/index.tsx

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
export default function Index() {
  const navigation = useNavigation<NavProp>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkProfile() {
      try {
        const response = await fetch('http://localhost:8080/get-profiles');
        const data = await response.json();

        if (!isMounted) return;

        if (data && data.length > 0) {
          requestAnimationFrame(() => {
            router.replace('/createProfile/select_profile');
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    checkProfile();

    return () => { isMounted = false; };
  }, []);

  const newProfile = () => {
    router.push("/createProfile/acc_purpose");
  };

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const profiles = () => {
    navigation.navigate("Profiles");
  };
  return (
<<<<<<<< HEAD:uter-us-frontend/screens/comp_name.tsx
    <ThemedView>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer]} type="header">
          Companion Selection
        </ThemedText>
      </View>
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing]}>Companion Name</ThemedText>
      <TextInput
        // value = {username} onChangeText={setUserName}
        style={[styles.textInput]}
        autoCapitalize="none"
        placeholder="Name" 
        placeholderTextColor="#94a3b8"
        maxLength={12}
      />
========
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
>>>>>>>> 5b3b9af82316ed0cecfd62c79054725f10808041:uter-us-frontend/app/index.tsx
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
          <Pressable 
          style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
          ]}
<<<<<<<< HEAD:uter-us-frontend/screens/comp_name.tsx
          onPress={profiles}>
            Create Profile
          </Pressable>
        </ThemedText>
========
          onPress={newProfile}>
          <ThemedText style={styles.createButtonText}>+ Create Profile</ThemedText>
        </Pressable>
>>>>>>>> 5b3b9af82316ed0cecfd62c79054725f10808041:uter-us-frontend/app/index.tsx
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
<<<<<<<< HEAD:uter-us-frontend/screens/comp_name.tsx
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
========

  createButtonText:{
    color: '#ffffff',
>>>>>>>> 5b3b9af82316ed0cecfd62c79054725f10808041:uter-us-frontend/app/index.tsx
  },
});
