import React from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable } from 'react-native';
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

export default function Index() {
  const navigation = useNavigation<NavProp>();
  const router = useRouter();

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
        <Pressable 
          style={({ pressed }) => [
            styles.createButtonContainer,
            pressed && styles.createButtonPressContainer
          ]}
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
