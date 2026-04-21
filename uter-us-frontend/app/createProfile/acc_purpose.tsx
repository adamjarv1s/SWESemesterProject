import React from 'react';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Alert, View, Pressable } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useRouter, useLocalSearchParams } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccPurpose'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AccPurposeScreen() {
  const navigation = useNavigation<NavProp>();
  const router = useRouter();


  const accDetails = (type: number) => {
    router.push(`/createProfile/acc_details?accountType=${type}`);
  };
  return (
    <ThemedView style={styles.wholeScreen}>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer, styles.blackText]} type="title">
          Account Purpose
        </ThemedText>
      </View>
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <ThemedText style={styles.inlineContainer}>
          <Pressable 
          style={({ pressed }) => [
          styles.createButtonContainer,
          pressed && styles.createButtonPressContainer
          ]}
          onPress={() => accDetails(0)}>
            <ThemedText style={[styles.createButtonText]}>
                Individual:
            </ThemedText>
            <ThemedText style={[{color: '#FFFFFF', fontFamily: "Arial"}]}>
                Track Your Own Cycle
            </ThemedText>
          </Pressable>
        </ThemedText>
      </View>
      <View style={[styles.inlineContainer, {marginTop: windowHeight * 0.01}]}>
        <ThemedText style={styles.inlineContainer}>
          <Pressable 
          style={({ pressed }) => [
          styles.createButtonContainer,
          pressed && styles.createButtonPressContainer
          ]}
          onPress={() => accDetails(1)}>
            <ThemedText style={[styles.createButtonText]}>
                Parent:
            </ThemedText>
            <ThemedText style={[styles.createButtonText, {fontFamily: "Arial"}]}>
                Track a Loved Ones Cycle
            </ThemedText>
          </Pressable>
        </ThemedText>
      </View>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    paddingTop: windowHeight * 0.10,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
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
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    textAlign: 'center',
  },

  createButtonText:{
    color: '#ffffff',
  },

  blackText:{
    color: '#000000',
  }
});