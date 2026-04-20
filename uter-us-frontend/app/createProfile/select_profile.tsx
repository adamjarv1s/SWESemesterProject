import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, Pressable, ScrollView, Text, ActivityIndicator } from 'react-native';
import { IPAddress } from '@/config';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPerson, faPlus } from '@fortawesome/free-solid-svg-icons';

// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useRouter, Link } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'SelectProfile'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type Profile = {
  name: string;
  pet: string;
  accountType: number;
}

const accountTypeLabel = (type: number): string => {
  switch (type) {
    case 0:
      return 'Individual';
    case 1:
      return 'Parent';
    default:
      return 'ThisIsJustToPreventAnError';
  }
};

async function getProfiles() {
  try {
    const response = await fetch(`${IPAddress}/get-profiles`);
    const json = await response.json();
    console.log(json);
    return json;

  } catch (error) {
    console.error('ErrorGetProfiles', error);
    return [];
  }
}

export default function SelectProfilesScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    getProfiles().then((data) =>{
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  return (
    <ThemedView style={styles.wholeScreen}>
      <Text style ={styles.existingUserLabel}>Existing User</Text>

      <View style={styles.card}>
        <ThemedText style={styles.title}>UterUs</ThemedText>
    {loading ? (
      <ActivityIndicator style={{marginTop: 40}} />
    ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {profiles.map((profile, index) => (
          <Pressable
            key={index}
            style={({pressed}) => [styles.profileRow, pressed && styles.profileRowPressed]}
            onPress={() => router.push('/dashboard')}
            >
            <View style={styles.avatarCircle}>
              <FontAwesomeIcon icon={faPerson} size={22} color="#555" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileType}>{accountTypeLabel(profile.accountType)}</Text>
              <Text style={styles.profileName}>{profile.pet}</Text>
            </View>
            </Pressable>
        ))}

        <Pressable
          style={({pressed}) => [styles.profileRow, pressed && styles.profileRowPressed]}
          onPress={() => router.push('/createProfile/acc_purpose' as any)}
          >
            <View style={styles.addCircle}>
              <FontAwesomeIcon icon={faPlus} size={18} color="#555"/>
            </View>
        </Pressable>
         </ScrollView> 
       )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    paddingTop: windowHeight * 0.07,
    paddingHorizontal: windowWidth * 0.05,
  },
  existingUserLabel: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'BreeSerif_400Regular',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 24,
    flex: 1,
    maxHeight: windowHeight * 0.82,
  },
  title: {
    fontSize: 32,
    fontFamily: 'BreeSerif_400Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
    color: '#111',
  },
  scrollContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  profileRowPressed: {
    backgroundColor: '#f0f0f0',
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ebebeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    gap: 2,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    fontFamily: 'BreeSerif_400Regular',
  },
  profileType: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'BreeSerif_400Regular',
  },
  profilePet: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'BreeSerif_400Regular',
  },
  addCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ebebeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProfileText: {
    fontSize: 16,
    color: '#111',
    fontFamily: 'BreeSerif_400Regular',
  },
});