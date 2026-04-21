import {useState} from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable, Text, TextInput } from 'react-native';
import { IPAddress } from '@/config';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView } from 'react-native-gesture-handler';

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
  const { accountType, averageCycleLength, averagePeriodLength, username, childName } = useLocalSearchParams<{
  accountType: string;
  averagePeriodLength: string;
  averageCycleLength: string;
  username: string;
  childName: string;
  }>();
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
        childName: childName,
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
<<<<<<< HEAD
    <ThemedView style={styles.wholeScreen}>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer, styles.blackText]} type="title">
           Account Details
        </ThemedText>
      </View>
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing, styles.elemSpace, styles.blackText]}>Name (Max 12 Characters)</ThemedText>
      <TextInput
        value = {username}
        onChangeText={setUserName}
        style={[styles.textInput]}
        autoCapitalize="none"
        placeholder="Name" 
        placeholderTextColor="#94a3b8"
        maxLength={12}
      />
        {accountType === "1" && (
          <>
            <ThemedText style={[styles.inlineContainer, styles.bodySpacing, styles.elemSpace, styles.blackText]}>
              Child&apos;s Name (Max 12 Characters)
            </ThemedText>
            <TextInput
              value={childName}
              onChangeText={setChildName}
              style={[styles.textInput]}
              autoCapitalize="none"
              placeholder="Name"
              placeholderTextColor="#94a3b8"
              maxLength={12}
            />
          </>
        )}
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing, styles.elemSpace, styles.blackText]}>Last Period Start Date</ThemedText>
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <Pressable 
          style={({ pressed }) => [
          styles.createDateButtonContainer,
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

      <ThemedText style={[styles.inlineContainer, styles.bodySpacing, styles.elemSpace, styles.blackText]}>Average Period Length</ThemedText>
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
      <ThemedText style={[styles.inlineContainer, styles.bodySpacing, styles.elemSpace, styles.blackText]}>Average Cycle Length</ThemedText>
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

      <View style={[{alignItems: 'center', width:'100%'}]}>
        <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.05}]}>
        <ThemedText style={[styles.inlineContainer, {alignItems: 'center'}]}>
          <Pressable 
            style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
            ]}
            onPress={() => compName(periodLength, cycleLength, username, childName)}>
              <ThemedText style={styles.createButtonText}>Continue</ThemedText>
          </Pressable>
        </ThemedText>
      </View>
=======
    <ScrollView contentContainerStyle={[{ flexGrow: 1 }]}>
      <ThemedView style={[styles.wholeScreen, { flex: 1 }]}>
       <ThemedView style={styles.wholeScreen}>
      <View style={[styles.topHeader]}>
      <ThemedText style={[styles.blackText, {fontFamily:"BreeSerif_400Regular"}]} type="title">
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
>>>>>>> f9b6ae7a88e05a1635befef6b07e93ac552d749b
      </View>

    
    </ThemedView>
    </ScrollView>
  );
}
const cellSize = (windowWidth * 0.80) / 3 - 12;

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: windowHeight * 0.05,
    backgroundColor: '#FAFAFA',
  },
  topHeader: {
    marginTop: windowHeight * 0.08,
    marginBottom: windowHeight * 0.04,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
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
    width: '80%',
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

  blackText:{
    color: '#000000',
  }
});