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
import { faGem, faFire, faHouse } from '@fortawesome/free-solid-svg-icons';
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


async function getFlowerPurchased(){
  try {
      const response = await fetch(`${IPAddress}/get-flower-purchased`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('ErrorUpdateCrownPurchase:', error);
      return '-';
    }
}

async function getCrownPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-crown-purchased`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('ErrorUpdateCrownPurchase:', error);
      return '-';
    }
  }

async function getBowPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-bow-purchased`);
      const text = await response.text();
      return text;
  
    } catch (error) {
      console.error('ErrorUpdateBowPurchase:', error);
      return '-';
    }
  }

async function getHotWaterPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-hotwater-purchased`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('ErrorUpdateHotWaterPurchase:', error);
      return '-';
    }
  }

async function getCandyPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-candy-purchased`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('ErrorUpdateCandyPurchase:', error);
      return '-';
    }
  }

async function getCurrentHeadwear() {
    try {
      const response = await fetch(`${IPAddress}/get-current-headwear`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('ErrorUpdateCurrentHeadwear:', error);
      return '0';
    }
  }

async function getCurrentHoldable() {
    try {
      const response = await fetch(`${IPAddress}/get-current-holdable`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('ErrorUpdateCurrentHoldable:', error);
      return '0';
    }
  }

export default function TabTwoScreen() {

  const navigation = useNavigation<NavProp>();
  const DrawerNavigation = useNavigation<NavPropDrawer>();
  const router = useRouter();

  const [showBuyModal, setShowBuyModal] = useState(false);

  const [userName, setUserName] = useState('Loading...');
  const [gems, setGems] = useState('gem');

  const [flowerPurchased, setFlowerPurchased] = useState('-');
  const [crownPurchased, setCrownPurchased] = useState('-');
  const [bowPurchased, setBowPurchased] = useState('-');
  const [hotWaterPurchased, setHotWaterPurchased] = useState('-');
  const [candyPurchased, setCandyPurchased] = useState('-');

  const [currentHeadwear, setCurrentHeadwear] = useState("0"); 
  const [currentHoldable, setCurrentHoldable] = useState("0");

  let [fontsLoaded] = useFonts({
      BreeSerif_400Regular
    });
  
    useEffect(() => {
      getUserName().then(name => setUserName(name));
      getGems().then(gems => setGems(gems));
      getFlowerPurchased().then(purchased => setFlowerPurchased(purchased));
      getCrownPurchased().then(purchased => setCrownPurchased(purchased));
      getBowPurchased().then(purchased => setBowPurchased(purchased));
      getHotWaterPurchased().then(purchased => setHotWaterPurchased(purchased));
      getCandyPurchased().then(purchased => setCandyPurchased(purchased));
      getCurrentHeadwear().then(headwear => setCurrentHeadwear(headwear));
      getCurrentHoldable().then(holdable => setCurrentHoldable(holdable));
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
                <FontAwesomeIcon size={20} color='#ffffff' icon={faHouse}/>
            </Pressable>
            </View>


            <ThemedText style={[styles.buddyPNG]}>
                buddy png
            </ThemedText>
          </View>
        </View>


        {/* Shop View -> Maybe a tab for outfits, tab for buddies? */}
          <View style={[styles.shopContainer]}>
            <View style={[styles.stepContainer]}>

              <ThemedText>
                Headwear
              </ThemedText>

              <View style={[styles.inlineContainer, styles.spacingContainer]}>
                <Pressable style={[styles.stepContainer, styles.itemContainer]}>
                  <Image source={require('../../assets/images/flowercrop.png')} style={[styles.image]} />
                  <ThemedText style={[styles.priceStyle]}>
                    100 <FontAwesomeIcon size={10} icon={faGem}/>
                  </ThemedText>
                </Pressable>
              

                <Pressable style={[styles.stepContainer, styles.itemContainer]}>
                  <Image source={require('../../assets/images/crowncrop.png')} style={[styles.image]} />
                  <ThemedText style={[styles.priceStyle]}>
                    100 <FontAwesomeIcon size={10} icon={faGem}/>
                  </ThemedText>
                </Pressable>

                <Pressable style={[styles.stepContainer, styles.itemContainer]}>
                  <Image source={require('../../assets/images/bowcrop.png')} style={[styles.image]} />
                  <ThemedText style={[styles.priceStyle]}>
                    100 <FontAwesomeIcon size={10} icon={faGem}/>
                  </ThemedText>
                </Pressable>
              </View>

              <ThemedText>
                Holdables
              </ThemedText>

              <View style={[styles.spacingContainer]}>
                <Pressable style={[styles.stepContainer, styles.itemContainer]}>
                  <Image source={require('../../assets/images/hotWaterPackcrop.png')} style={[styles.image]} />
                  <ThemedText style={[styles.priceStyle]}>
                    50 <FontAwesomeIcon size={10} icon={faGem}/>
                  </ThemedText>
                </Pressable>

                <Pressable style={[styles.stepContainer, styles.itemContainer]}>
                  <Image source={require('../../assets/images/candycrop.png')} style={[styles.image]} />
                  <ThemedText style={[styles.priceStyle]}>
                    50 <FontAwesomeIcon size={10} icon={faGem}/>
                  </ThemedText>
                </Pressable>


              </View>
            </View>
          </View>

        {/* REF FROM ABBY

        <Pressable
              disabled={!selectedDate}
              style={({ pressed }) => [
                styles.buttonContainer,
                pressed && styles.buttonPressedContainer,
                !selectedDate && { opacity: 0.4 }
              ]}
              onPress={() => setShowBuyModal(true)}
            >
              <ThemedText style={styles.buttonText}>Buy Item</ThemedText>
            </Pressable>

            <Modal
              visible={showBuyModal}
              transparent={true}
              animationType="fade"
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <ThemedText style={styles.modalTitle}>Buy Item?</ThemedText>

                      <Pressable
                        style={styles.saveButton}
                        onPress={async () => {

                          try {
                            await fetch(`${IPAddress}/log-period`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                currentDate: selectedDate,
                                heaviness: flow,
                                lastDay: false,
                                description: symptoms || '',
                            }),
                            });

                            const updatedPeriodData = await getPeriodData();
                            setPeriodData(updatedPeriodData);
                            getCycleAlerts();

                            setShowBuyModal(false);
                            setSymptoms('');

                          } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Could not connect to server');
                          }
                        }}
                      >
                        <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
                          Cancel
                        </ThemedText>
                      </Pressable>

                    </View>
                </View>
            </Modal> */}


    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    backgroundColor:  '#FAFAFA',
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  spacingContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
    gap: 17,
  },

  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
  },

  topHeader: {
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.05,
    marginBottom: windowHeight * 0.02,
    justifyContent: 'space-between',
    //backgroundColor: '#A1CEDC',
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
    borderRadius: 5,
    color: '#ffffff',
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
  },

  buttonShopPressedContainer: {
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },

  shopContainer:{
    backgroundColor: '#ffffff',
    flex:1,
    padding: windowWidth * 0.03,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    marginBottom: windowHeight * 0.05,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E7',
    borderRadius: 5,
  },

  itemContainer:{
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 5,
    paddingBottom: windowHeight * 0.01,
    paddingLeft: windowWidth * 0.05,
    paddingRight: windowWidth * 0.05,
    width: '30%',
    alignItems: 'center',
  },
  image: {
    width: windowWidth * 0.18,
    height: windowHeight * 0.09,
    //backgroundColor: '#dcdcdc',
    resizeMode: 'cover',
  },

  priceStyle:{
    width: '100%',
    textAlign: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
});
