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
import { useRouter } from 'expo-router';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccPurpose'>;

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AccPurposeScreen() {
  const navigation = useNavigation<NavProp>();
  const router = useRouter();

  const accDetails = () => {
    router.push("/createProfile/acc_details");
  };
  return (
    <ThemedView style={styles.wholeScreen}>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <ThemedText style={[styles.inlineContainer]} type="header">
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
          onPress={accDetails}>
            <ThemedText style={[styles.inlineContainer, styles.createButtonText]} type = {"faint"}>
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
          onPress={accDetails}>
            Parent
            <ThemedText style={[styles.inlineContainer, styles.createButtonText]} type = {"faint"}>
                Track a Loved Ones Cycle
            </ThemedText>
          </Pressable>
        </ThemedText>
      </View>
    </ThemedView>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    paddingTop: windowHeight * 0.10,
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
    alignItems: 'center',
    textAlign: 'center',
  },

  createButtonText:{
    color: '#ffffff',
  },
});
