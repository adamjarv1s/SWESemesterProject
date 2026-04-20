import {useState} from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable, Text, TextInput } from 'react-native';
import { IPAddress } from '@/config';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CompName'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PETS = [
  { id: 1, name: 'Chiikawa', image: require('../../assets/images/chiiwawa.png') },
  { id: 2, name: 'Shadow',   image: require('../../assets/images/shadow.png') },
  { id: 3, name: 'Bird',     image: require('../../assets/images/birb.png') },
];

export default function CompNameScreen() {
  const router = useRouter();
  const { accountType, averageCycleLength } = useLocalSearchParams<{
  accountType: string;
  averagePeriodLength: string;
  averageCycleLength: string;
  }>();
  const [username, setuserName] = useState('');
  const [pet, setPet] = useState('');
  const [petId, setPetId] = useState(0);

  const profiles = () => {
    router.push("../(tabs)/dashboard");
  };

  async function CreateProfile() {
  try {
    const response = await fetch(`${IPAddress}/create-user`, {
      body: JSON.stringify({
        name: username,
        pet,
        pet_id: petId,
        accountType: Number(accountType),
        averageCycleLength: Number(averageCycleLength),
      }),
    });

    if (response.ok) {
      Alert.alert('Success', 'Profile created!');
    } else {
      Alert.alert('Error', 'Failed to create profile');
    }

    router.push('/(tabs)/dashboard');
  } catch (error) {
    Alert.alert('Error', 'Could not connect to server');
  }
}
  return (
    <ThemedView style={styles.wholeScreen}>
      <View style={[styles.topHeader]}>
        <ThemedText style={[]} type="title">
          Companion Selection
        </ThemedText>
      </View>
      <ThemedText style={[styles.bodySpacing]}>Companion Name</ThemedText>
        <TextInput
          value={username}
          onChangeText={setuserName}
          style={[styles.textInput]}
          autoCapitalize="none"
          placeholder="Name"
          placeholderTextColor="#94a3b8"
          maxLength={12}
        />


        <Pressable
          style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
          ]}
          onPress={CreateProfile}
        >
          <ThemedText style={styles.createButtonText}>Create Profile</ThemedText>
        </Pressable>
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
