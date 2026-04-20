import { Image } from 'expo-image';
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

import { Modal, TextInput } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faGem, faFire, faStore } from '@fortawesome/free-solid-svg-icons';
import { useFonts } from '@expo-google-fonts/bree-serif/useFonts';
import { BreeSerif_400Regular } from '@expo-google-fonts/bree-serif/400Regular';


// React Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useRouter } from 'expo-router';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { IPAddress } from '@/config';


type NavPropDrawer = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccPurpose'>;



// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

  async function getGems() {
    try {
      const response = await fetch(`${IPAddress}/update-gems`);
      const text = await response.text();
      return text;
  
    } catch (error) {
      console.error('ErrorUpdateGems:', error);
      return 'GEMSNUM';
    }
  }

export default function TabTwoScreen() {

  const navigation = useNavigation<NavProp>();
  const DrawerNavigation = useNavigation<NavPropDrawer>();
  const router = useRouter();

  const [showLogModal, setShowLogModal] = useState(false);

  const [userName, setUserName] = useState('Loading...');
  const [gems, setGems] = useState('gem');

  let [fontsLoaded] = useFonts({
      BreeSerif_400Regular
    });
  
    useEffect(() => {
      getGems().then(gems => setGems(gems));
    }, []);
    
  
    if (!fontsLoaded) {
      return null;
    }
  
    const toDashboard = () => {
      router.push("./dashboard");
    };



  


  return (
    <ThemedView style={[styles.wholeScreen]}>
      <View style={[styles.inlineContainer, styles.topHeader]}>
        <Pressable onPress={() => DrawerNavigation.openDrawer()}>
          <FontAwesomeIcon icon={faBars} size={20}/>
        </Pressable>
      
          <ThemedText style={[styles.welcomeUserMessage]}>
            Hello, {userName}!
          </ThemedText>
      
        <FontAwesomeIcon icon={faSignOutAlt} size={20}/>
      </View>

      {/* Buddy System -> Gems, Streak, Buddy Image, Shop/Buddy Settings */}
        <View style={[styles.buddyContainer]}>
          <View style={[{alignItems: 'center'}]}>
            <View style={[styles.inlineContainer, styles.infoContainers]}>
              <View style={[styles.inlineContainer]}>
                <ThemedText style={[styles.infoContainer]}>
                  {gems} <FontAwesomeIcon size={10} icon={faGem}/>
                </ThemedText>

              </View>

              <Pressable 
              style={[styles.buttonShopContainer]}
              onPress={toDashboard}>
                <FontAwesomeIcon size={20} color='#ffffff' icon={faStore}/>
            </Pressable>
            </View>


            <ThemedText style={[styles.buddyPNG]}>
                buddy image
            </ThemedText>
          </View>
        </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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

  //above is needed for top header

  buddyContainer: {
    backgroundColor: '#e5ffbf',
    height: windowHeight * 0.23,
    paddingLeft: windowWidth * 0.03,
    paddingRight: windowWidth * 0.03,
    paddingTop: windowHeight * 0.007,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    marginBottom: windowHeight * 0.02,
    overflow: 'hidden',
  },

  buttonContainer: {
    padding: 10,
    borderRadius: 5,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },

  buttonText: {
    color: '#F5F5F5',
  },

  buttonPressedContainer: {
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(206, 206, 206, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoContainers:{
    justifyContent: "space-between",
  },

  infoContainer:{
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
    marginRight: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 13,
    alignItems: 'center',
  },

  buddyPNG: {
    alignContent: 'center',
    verticalAlign: 'bottom',
    height: '60%',
  },

  buttonShopContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    borderRadius: 5,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },

  buttonShopPressedContainer: {
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },
});
