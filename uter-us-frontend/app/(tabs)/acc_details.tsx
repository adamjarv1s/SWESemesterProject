import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable, Text, TextInput } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, router } from 'expo-router';

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const accDetails = async () => {
    router.replace('/acc_details');
}

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
    <ThemedView>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer]} type="header">
          Account Details
        </ThemedText>
      </View>
      <Text className="p-1 text-center">Name (Max 12 Characters)</Text>
            <TextInput
                // value = {username} onChangeText={setUserName}
                autoCapitalize="none"
                placeholder="Name" placeholderTextColor="#94a3b8"   
            />
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <ThemedText style={styles.inlineContainer}>
          <Pressable 
          style={({ pressed }) => [
          styles.createButtonContainer,
          pressed && styles.createButtonPressContainer
          ]}
          onPress={() => accDetails}>
            Parent
            <ThemedText style={styles.inlineContainer} type = {"faint"}>
                Track a Loved One's Cycle
            </ThemedText>
          </Pressable>
        </ThemedText>
      </View>
    </ThemedView>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 5,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },
  createButtonPressContainer:{
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },
});
