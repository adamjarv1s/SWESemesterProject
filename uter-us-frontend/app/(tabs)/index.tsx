import { Image } from 'expo-image';
import { Platform, StyleSheet, Alert } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

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

export default function HomeScreen() {
  return (
    /*<ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>*/
    <ThemedView /*style={styles.titleContainer}*/>
      <ThemedText style={styles.titleContainer}
        type="title">
        UterUs
      </ThemedText>
      <HelloWave />
      <ThemedText style={styles.stepContainer} type="subtitle">Welcome!</ThemedText>
      <ThemedText style={styles.stepContainer} type="defaultSemiBold">Create a Profile to Get Started!</ThemedText>
      <ThemedText type="link">
        <Link href="https://github.com/adamjarv1s/SWESemesterProject" target="_blank" rel="noopener noreferrer">Link to Github </Link>
      </ThemedText>
      <ThemedText type="link">
        <button onClick={HandleCreateProfile}>{"+ Create a Profile"}</button>
      </ThemedText>
    </ThemedView>
    // </ParallaxScrollView>
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
});
