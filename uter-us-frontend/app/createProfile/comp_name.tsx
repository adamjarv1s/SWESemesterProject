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
import { useLocalSearchParams, useRouter, Link } from 'expo-router';

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
  const { accountType, averageCycleLength, averagePeriodLength } = useLocalSearchParams<{
  accountType: string;
  averagePeriodLength: string;
  averageCycleLength: string;
  }>();
  const [username, setuserName] = useState('');
  const [petName, setPetName] = useState('');
  const [petId, setPetId] = useState<number | null>(null);


async function CreateProfile() {
  if (!petId) {
    Alert.alert('Please select a companion first!');
    return;
  }
  try {
    const response = await fetch(`${IPAddress}/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: username,
        pet: petName,
        pet_id: petId,
        accountType: Number(accountType),
        averageCycleLength: Number(averageCycleLength),
        averagePeriodLength: Number(averagePeriodLength),
      }),
    });
    if (response.ok) {
      router.push('/(tabs)/dashboard' as any);
    } else {
      Alert.alert('Error', 'Failed to create profile');
    }
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

      <View style={styles.grid}>
        {PETS.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.petCell, petId === item.id && styles.petCellSelected]}
            onPress={() => { setPetId(item.id); setPetName(item.name); }}
          >
            <Image source={item.image} style={styles.petImage} />
          </Pressable>
        ))}
      </View>

    <View style={styles.card}>
      <ThemedText style={[styles.bodySpacing]}>Companion Name</ThemedText>
        <TextInput
          value={username}
          onChangeText={setuserName}
          style={[styles.textInput]}
          autoCapitalize="none"
          placeholder="..."
          placeholderTextColor="#94a3b8"
          maxLength={12}
        />


        <Pressable
          style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
          onPress={CreateProfile}
        >
          <ThemedText style={styles.createButtonText}>Create Profile</ThemedText>
        </Pressable>

        <Link href="../(tabs)/dashboard" 
      style={{textAlign: 'center', color: '#007AFF', backgroundColor: '#848484', width:'50%', alignSelf: 'center', padding: 10, borderRadius: 5, marginTop: windowHeight * 0.02}}>
        to dashboard
      </Link>
        </View>
    </ThemedView>
  );
}
const cellSize = (windowWidth * 0.85) / 3 - 12;

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: windowHeight * 0.05,
  },
  topHeader: {
    marginTop: windowHeight * 0.08,
    marginBottom: windowHeight * 0.04,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '85%',
    gap: 12,
    justifyContent: 'center',
    marginBottom: windowHeight * 0.04,
  },
  petCell: {
    width: cellSize,
    height: cellSize,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  petCellSelected: {
    borderColor: '#1c1c1c',
    backgroundColor: '#e0e0e0',
  },
  petImage: {
    width: '80%',
    height: '80%',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#555',
    fontSize: 14,
  },
  textInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  createButton: {
    width: '100%',
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  createButtonPressed: {
    backgroundColor: '#333',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bodySpacing: {
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.005,
    marginBottom: windowHeight * 0.005,
  },
});