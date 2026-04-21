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
import { parse } from '@fortawesome/fontawesome-svg-core';


type NavPropDrawer = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'AccPurpose'>;



// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function getDiamonds() {
  try {
    const response = await fetch(`${IPAddress}/get-diamonds`);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('ErrorGetDiamonds:', error);
    return '0';
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
      return parseInt(text);
    } catch (error) {
      console.error('ErrorUpdateCrownPurchase:', error);
      return -1;
    }
}

async function getCrownPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-crown-purchased`);
      const text = await response.text();
      return parseInt(text);
    } catch (error) {
      console.error('ErrorUpdateCrownPurchase:', error);
      return -1;
    }
  }

async function getBowPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-bow-purchased`);
      const text = await response.text();
      return parseInt(text);
  
    } catch (error) {
      console.error('ErrorUpdateBowPurchase:', error);
      return -1;
    }
  }

async function getHotWaterPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-hotwater-purchased`);
      const text = await response.text();
      return parseInt(text);
    } catch (error) {
      console.error('ErrorUpdateHotWaterPurchase:', error);
      return -1;
    }
  }

async function getCandyPurchased() {
    try {
      const response = await fetch(`${IPAddress}/get-candy-purchased`);
      const text = await response.text();
      return parseInt(text);
    } catch (error) {
      console.error('ErrorUpdateCandyPurchase:', error);
      return -1;
    }
  }

async function getCurrentHeadwear() {
  try { 
    const response = await fetch(`${IPAddress}/get-current-headwear`);
    const text = await response.text();
    return parseInt(text);
  } catch (error) {
    console.error('ErrorGetCurrentHeadwear:', error);
    return 0;
  }
}

async function getCurrentHoldable() {
  try { 
    const response = await fetch(`${IPAddress}/get-current-holdable`);
    const text = await response.text();
    return parseInt(text);
  } catch (error) {
    console.error('ErrorGetCurrentHoldable:', error);
    return 0;
  }
}

async function getPetId() {
  try {
    const response = await fetch(`${IPAddress}/get-pet-id`);
    const text = await response.text();
    return parseInt(text);

  } catch (error) {
    console.error('ErrorGetPetId:', error);
    return -1;
  }
}


export default function TabTwoScreen() {

  const navigation = useNavigation<NavProp>();
  const DrawerNavigation = useNavigation<NavPropDrawer>();
  const router = useRouter();

  const [showBuyModal, setShowBuyModal] = useState(false);

  const [userName, setUserName] = useState('Loading...');
  const [diamondCount, setDiamondCount] = useState('0');
  const [petId, setPetId] = useState(0);

  const [flowerPurchased, setFlowerPurchased] = useState(-1);
  const [crownPurchased, setCrownPurchased] = useState(-1);
  const [bowPurchased, setBowPurchased] = useState(-1);
  const [hotWaterPurchased, setHotWaterPurchased] = useState(-1);
  const [candyPurchased, setCandyPurchased] = useState(-1);

  const [currentHeadwear, setCurrentHeadwear] = useState(0);
  const [currentHoldable, setCurrentHoldable] = useState(0);
  const [whichItem, setWhichItem] = useState<number | null>(null);

  let [fontsLoaded] = useFonts({
      BreeSerif_400Regular
    });
  
    useEffect(() => {
      getUserName().then(name => setUserName(name));
      getDiamonds().then(diamonds => setDiamondCount(diamonds));
      getPetId().then(id => setPetId(id));
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
      {/* Top Header Bar -> Hamburger Menu, Hello [User], and Log Out 
                  NOTES:
                      - Need to change the icons into buttons
                          - faBars needs to open the sidebar menu
                          - faSignOutAlt needs to log out the user and return to profiles/index screen
      
                      - Once database is set up, need to replace "name" with the active user's name */}
      
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
                
                
              
              {/* Buddy System -> Gems, Streak, Buddy Image, Shop/Buddy Settings */}
              <View style={[styles.buddyContainer]}>
                <View style={[styles.stepContainer, {alignItems: 'center'}]}>
                  <View style={[styles.inlineContainer, styles.infoContainers]}>
                    <View style={[styles.inlineContainer]}>
                      <ThemedText style={[styles.infoContainer]}>
                        {diamondCount} <FontAwesomeIcon size={10} icon={faGem}/>
                      </ThemedText>
      
                    </View>
      
                  <Pressable 
                    style={[styles.buttonShopContainer]}
                    onPress={toDashboard}>
                      <FontAwesomeIcon size={20} color='#ffffff' icon={faHouse}/>
                  </Pressable>
                  </View>
      
      
                  <View style={[styles.container]}>
                    <View style={[styles.buddy]}>
                      {petId === 1 && <Image source={require('../../assets/images/chiiwawa.png')} style={[styles.image]} />}
                      {petId === 2 && <Image source={require('../../assets/images/shadow.png')} style={[styles.image]} />}
                      {petId === 3 && <Image source={require('../../assets/images/birb.png')} style={[styles.image]} />}
                      {petId !== 1 && petId !== 2 && petId !== 3 && <ThemedText>buddy err</ThemedText>}
                    </View>
      
                    <View style={[styles.overlayHand]}>
                      {currentHoldable === 4 && <Image source={require('../../assets/images/hotWaterPack.png')} style={[styles.image]} />}
                      {currentHoldable === 5 && <Image source={require('../../assets/images/candy.png')} style={[styles.image]} />}
                      {currentHoldable !== 4 && currentHoldable !== 5 && <ThemedText>err</ThemedText>}
                    </View>
      
                    <View style={[styles.overlayHead]}>
                      {currentHeadwear === 1 && <Image source={require('../../assets/images/flower.png')} style={[styles.image]} />}
                      {currentHeadwear === 2 && <Image source={require('../../assets/images/crown.png')} style={[styles.image]} />}
                      {currentHeadwear === 3 && <Image source={require('../../assets/images/bow.png')} style={[styles.image]} />}
                      {currentHeadwear !== 1 && currentHeadwear !== 2 && currentHeadwear !== 3 && <ThemedText></ThemedText>}
                    </View>
                  </View>
      
                  {/* <View style={[styles.buddyPNG]}>
                      {petId === 1 && <Image source={require('../../assets/images/chiiwawa.png')} style={[styles.image]} />}
                      {petId === 2 && <Image source={require('../../assets/images/shadow.png')} style={[styles.image]} />}
                      {petId === 3 && <Image source={require('../../assets/images/birb.png')} style={[styles.image]} />}
                      {petId !== 1 && petId !== 2 && petId !== 3 && <ThemedText>buddy</ThemedText>}
                  </View> */}
                </View>
              </View>


              {/* Shop View -> Maybe a tab for outfits, tab for buddies? */}
          <View style={[styles.shopContainer]}>
            <View style={[styles.stepContainer]}>

              <ThemedText>
                Headwear
              </ThemedText>

              <View style={[styles.inlineContainer, styles.spacingContainer]}>
                <Pressable
                  style={[styles.stepContainer, , styles.itemContainer]}
                  onPress={async () => {
                    if (flowerPurchased === 1) {
                      // Set current headwear to 1 (flower)
                      try {
                        await fetch(`${IPAddress}/set-current-headwear?headwear=1`, {
                          method: 'POST',
                        });
                        setCurrentHeadwear(1);
                      } catch (error) {
                        console.error(error);
                      }
                    } else {
                      setWhichItem(1);
                      setShowBuyModal(true);
                    }
                  }}
                  >
                  <Image source={require('../../assets/images/flowercrop.png')} style={[styles.itemImage]} />
                  <ThemedText style={[styles.priceStyle]}>
                    {flowerPurchased === 0 && <ThemedText>100 <FontAwesomeIcon size={10} icon={faGem}/></ThemedText>}
                    {flowerPurchased === 1 && <ThemedText>Owned!</ThemedText>}
                    {flowerPurchased !== 0 && flowerPurchased !== 1 && <ThemedText>err</ThemedText>}
                  </ThemedText>
                </Pressable>
              

                <Pressable
                  style={[styles.stepContainer, , styles.itemContainer]}
                  onPress={async () => {
                    if (crownPurchased === 1) {
                      // Set current headwear to 2 (crown)
                      try {
                        await fetch(`${IPAddress}/set-current-headwear?headwear=2`, {
                          method: 'POST',
                        });
                        setCurrentHeadwear(2);
                      } catch (error) {
                        console.error(error);
                      }
                    } else {
                      setWhichItem(2);
                      setShowBuyModal(true);
                    }
                  }}
                  >
                  <Image source={require('../../assets/images/crowncrop.png')} style={[styles.itemImage]} />
                  <ThemedText style={[styles.priceStyle]}>
                    {crownPurchased === 0 && <ThemedText>100 <FontAwesomeIcon size={10} icon={faGem}/></ThemedText>}
                    {crownPurchased === 1 && <ThemedText>Owned!</ThemedText>}
                    {crownPurchased !== 0 && crownPurchased !== 1 && <ThemedText>err</ThemedText>}
                  </ThemedText>
                </Pressable>

                <Pressable
                  style={[styles.stepContainer, , styles.itemContainer]}
                  onPress={async () => {
                    if (bowPurchased === 1) {
                      // Set current headwear to 3 (bow)
                      try {
                        await fetch(`${IPAddress}/set-current-headwear?headwear=3`, {
                          method: 'POST',
                        });
                        setCurrentHeadwear(3);
                      } catch (error) {
                        console.error(error);
                      }
                    } else {
                      setWhichItem(3);
                      setShowBuyModal(true);
                    }
                  }}
                  >
                  <Image source={require('../../assets/images/bowcrop.png')} style={[styles.itemImage]} />
                  <ThemedText style={[styles.priceStyle]}>
                    {bowPurchased === 0 && <ThemedText>100 <FontAwesomeIcon size={10} icon={faGem}/></ThemedText>}
                    {bowPurchased === 1 && <ThemedText>Owned!</ThemedText>}
                    {bowPurchased !== 0 && bowPurchased !== 1 && <ThemedText>err</ThemedText>}
                  </ThemedText>
                </Pressable>
              </View>

              <ThemedText>
                Holdable
              </ThemedText>

              <View style={[styles.spacingContainer]}>
                <Pressable
                  style={[styles.stepContainer, , styles.itemContainer]}
                  onPress={async () => {
                    if (hotWaterPurchased === 1) {
                      // Set current holdable to 4 (hot water)
                      try {
                        await fetch(`${IPAddress}/set-current-holdable?holdable=4`, {
                          method: 'POST',
                        });
                        setCurrentHoldable(4);
                      } catch (error) {
                        console.error(error);
                      }
                    } else {
                      setWhichItem(4);
                      setShowBuyModal(true);
                    }
                  }}
                  >
                  <Image source={require('../../assets/images/hotWaterPackcrop.png')} style={[styles.itemImage]} />
                  <ThemedText style={[styles.priceStyle]}>
                    {hotWaterPurchased === 0 && <ThemedText>50 <FontAwesomeIcon size={10} icon={faGem}/></ThemedText>}
                    {hotWaterPurchased === 1 && <ThemedText>Owned!</ThemedText>}
                    {hotWaterPurchased !== 0 && hotWaterPurchased !== 1 && <ThemedText>err</ThemedText>}
                  </ThemedText>
                </Pressable>

                <Pressable
                  style={[styles.stepContainer, , styles.itemContainer]}
                  onPress={async () => {
                    if (candyPurchased === 1) {
                      // Set current holdable to 5 (candy)
                      try {
                        await fetch(`${IPAddress}/set-current-holdable?holdable=5`, {
                          method: 'POST',
                        });
                        setCurrentHoldable(5);
                      } catch (error) {
                        console.error(error);
                      }
                    } else {
                      setWhichItem(5);
                      setShowBuyModal(true);
                    }
                  }}
                  >
                  <Image source={require('../../assets/images/candycrop.png')} style={[styles.itemImage]} />
                  <ThemedText style={[styles.priceStyle]}>
                    {candyPurchased === 0 && <ThemedText>50 <FontAwesomeIcon size={10} icon={faGem}/></ThemedText>}
                    {candyPurchased === 1 && <ThemedText>Owned!</ThemedText>}
                    {candyPurchased !== 0 && candyPurchased !== 1 && <ThemedText>err</ThemedText>}
                  </ThemedText>
                </Pressable>


              </View>
            </View>
          </View>

        <Modal
              visible={showBuyModal}
              transparent={true}
              animationType="fade"
              >
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalContent, { alignItems: 'center' }]}>
                    <ThemedText style={[styles.modalTitle]}>Buy Item?</ThemedText>
                      <View style={[styles.inlineContainer, {gap: 20}]}>
                        <Pressable
                        style={[styles.buyButton]}
                        onPress={async () => {
                          try {
                            if (whichItem !== null) {
                              await fetch(`${IPAddress}/update-purchase`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ item: whichItem }),
                              });
                            }
                            setShowBuyModal(false);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      >
                        <ThemedText style={{ color: '#ffffff', textAlign: 'center' }}>
                          Buy
                        </ThemedText>
                      </Pressable>


                      <Pressable
                        style={styles.cancelButton}
                        onPress={async () => {
                          try {
                            setShowBuyModal(false);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      >
                        <ThemedText style={{ color: '#000000', textAlign: 'center' }}>
                          Cancel
                        </ThemedText>
                      </Pressable>
                      </View>
                    </View>
                </View>
            </Modal>

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
    width: windowWidth * 0.3,
    height: windowHeight * 0.2,
    resizeMode: 'contain',
  },
   itemImage: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.1,
    resizeMode: 'contain',
   },

  container: {
    position: 'relative',
    marginTop: -windowHeight * 0.03,
  },

  buddy:{
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  overlayHand:{
    position: 'absolute',
    resizeMode: 'contain',
  },

  overlayHead:{
    position: 'absolute',
    resizeMode: 'contain',
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

  buyButton: {
    backgroundColor: '#1f1f1f',
    padding: 10,
    width: windowWidth * 0.3,
    borderRadius: 5,
    borderWidth: 1,
  },

  cancelButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    width: windowWidth * 0.3,
    borderRadius: 5,
    borderWidth: 1,
  },
});
