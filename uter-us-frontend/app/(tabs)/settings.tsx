import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Pressable, Alert, View } from 'react-native';
import { IPAddress } from '@/config';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useEffect, useState } from 'react';
import type { RootStackParamList } from '../../types';
import { Modal, TextInput } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type NavPropDrawer = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccPurpose'>;


async function printAllData() {
  try {
    const response = await fetch(`${IPAddress}/print-all-data`);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error("PrintAllDataError:", error);
  }
}

async function deleteAllData() {
  try {
    const response = await fetch(`${IPAddress}/delete-all-data`);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error("DeleteAllDataError:", error);
  }
}

async function getUserName() {
  try {
    const response = await fetch(`${IPAddress}/get-user`);
    const text = await response.text();
    return text;

  } catch (error) {
    console.error('ErrorGetUsername:', error);
    return 'Unpeakawa';
  }
}



export default function TabTwoScreen() {

    const DrawerNavigation = useNavigation<NavPropDrawer>();
    const router = useRouter();

  const [userName, setUserName] = useState('Loading...');

    useEffect(() => {
      getUserName().then(name => setUserName(name));
    }, []);
  return (

    
    <View>

    <View style={[styles.inlineContainer, styles.topHeader]}>
                <Pressable onPress={() => DrawerNavigation.openDrawer()}>
                  <FontAwesomeIcon icon={faBars} size={20}/>
                </Pressable>
    
                <ThemedText style={[styles.welcomeUserMessage]}>
                    Hello, {userName}!
                </ThemedText>
    
              <Pressable onPress={() => router.push("../createProfile/select_profile")}>
                <FontAwesomeIcon icon={faSignOutAlt} size={20}/>
              </Pressable>
            </View>

    <Pressable style={styles.buttonContainer} onPress={printAllData}>
      <ThemedText style={styles.buttonText}>Print All Data</ThemedText>
    </Pressable>
    <ThemedText style={styles.buttonLabel}>Download a .csv of your period data</ThemedText>

    <Pressable
      style={styles.buttonDangerContainer}
      onPress={() => {
        if (Platform.OS === 'web') {
          const confirmed = window.confirm(
            "Are you sure you want to delete ALL your data? This cannot be undone."
          );
          if (confirmed) {
            deleteAllData();
            router.push("../../");
          }
        } else {
          Alert.alert(
            "Delete All Data",
            "Are you sure you want to delete ALL your data? This cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: deleteAllData },
            ]
          );
          router.push("../../");
        }
      }}
    >
      <ThemedText style={styles.buttonDangerText}>Delete All Data</ThemedText>
    </Pressable>
    <ThemedText style={[styles.buttonDangerText, styles.buttonLabel]}>Delete ALL of your period data (Permanent and Not Reversible)</ThemedText>

    </View>
  );
}
const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    backgroundColor:  '#FAFAFA',
  },

  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
    buttonContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 5,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  buttonDangerContainer: {
    width: "90%",
    padding: 10,
    borderRadius: 5,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ff0000',
    borderWidth: 1,
    borderColor: '#ff0000',
    backgroundColor: '#FFDDDD',
    alignItems: 'center',
  },

  buttonText: {
    color: '#000000',
  },

  buttonDangerText: {
    color: '#ff0000',
  },

  buttonLabel:{
    marginLeft: windowWidth * 0.05,
    marginBottom: windowHeight * 0.03,
  },

  topHeader: {
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.05,
    marginBottom: windowHeight * 0.02,
    justifyContent: 'space-between',
    //backgroundColor: '#A1CEDC',
  },

  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
  },

  welcomeUserMessage: {
    fontSize: 20,
    fontFamily: "BreeSerif_400Regular",
  },
  blackText:{
    color: '#000000',
  },
});