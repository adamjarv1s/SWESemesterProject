import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {

  return (
    <ThemedView>

        {/* Top Header Bar -> Hamburger Menu, Hello User, and Log Out */}
        <View style={[styles.inlineContainer, styles.topHeader]}>
            <FontAwesomeIcon icon={faBars} size={20}/>

            <ThemedText style={[styles.topHeader, { fontFamily: "BreeSerif_400Regular" }]}>
                Hello, name!
            </ThemedText>

            <FontAwesomeIcon icon={faSignOutAlt} size={20}/>
        </View>
          
          

    </ThemedView>
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

  topHeader: {
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 30,
    marginBottom: 30,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: "BreeSerif_400Regular",
    backgroundColor: '#A1CEDC',
  },

  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
    justifyContent: 'space-between',
  }

  
});
