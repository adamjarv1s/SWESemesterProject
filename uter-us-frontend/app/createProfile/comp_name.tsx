import React from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable, Text, TextInput } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useRouter, Link } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CompName'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function HandleCreateProfile() {
  try {
    const response = await fetch('http://localhost:8080/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Jared', pet: 'Shadow', accountType: 1 }) 
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

export default function CompNameScreen() {
  const navigation = useNavigation<NavProp>();
  const router = useRouter();

  const profiles = () => {
    router.push("/");
  };
  return (
    <ThemedView style={styles.wholeScreen}>
      <View style={[styles.topHeader]}>
        <ThemedText style={[]} type="title">
          Companion Selection
        </ThemedText>
      </View>
      <ThemedText style={[styles.bodySpacing]}>Companion Name</ThemedText>
      <TextInput
        // value = {username} onChangeText={setUserName}
        style={[styles.textInput]}
        autoCapitalize="none"
        placeholder="Name" 
        placeholderTextColor="#94a3b8"
        maxLength={12}
      />


      <ThemedText style={[styles.createButtonContainer]}>
          <Pressable 
          style={({ pressed }) => [
          pressed && styles.createButtonPressContainer
          ]}
          onPress={profiles}>
            <ThemedText style={styles.createButtonText}>Create Profile</ThemedText>
          </Pressable>
      </ThemedText>


      {/* TEMPORARY LINK TO DASHBOARD FOR TESTING!!!

          when we can get to dashboard from index (profiles page) REMOVE THIS!!!
      
      */}
      
      <Link href="../(tabs)/dashboard" 
      style={{textAlign: 'center', color: '#007AFF', backgroundColor: '#848484', width:'50%', alignSelf: 'center', padding: 10, borderRadius: 5, marginTop: windowHeight * 0.02}}>
        to dashboard
      </Link>
    </ThemedView>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    paddingTop: windowHeight * 0.05,
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
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: windowHeight * 0.05,
  },
  createButtonPressContainer:{
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },
  textInput:{
    marginLeft: windowWidth * 0.05,
    height: 45,
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontFamily: "BreeSerif_400Regular",
  },

  createButtonText:{
    color: '#ffffff',
  },
});
