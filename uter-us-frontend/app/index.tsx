import React, {useState, useEffect} from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable } from 'react-native';
import { IPAddress } from '@/config';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TextInput } from 'react-native-gesture-handler';
import SelectProfilesScreen from './createProfile/select_profile';
// React Navigation

import { Link } from '@react-navigation/native';
import { useRouter } from 'expo-router';

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
        <ThemedText type="default">Create a Profile to Get Started!</ThemedText>
      </View>
      <View style={[styles.inlineContainer, styles.createButtonContainer]}>
          <Pressable 
          onPress={newProfile}>
          <ThemedText style={styles.createButtonText}>+ Create Profile</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    paddingTop: windowHeight * 0.15,
    alignItems: 'center',
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
    marginTop: windowHeight * 0.05,
    width: "60%",
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
  createButtonText:{
    color: '#ffffff',
  }
});