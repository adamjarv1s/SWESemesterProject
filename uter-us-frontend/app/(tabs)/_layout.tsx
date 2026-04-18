import React from 'react';
import { Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useFonts } from '@expo-google-fonts/bree-serif/useFonts';
import { BreeSerif_400Regular } from '@expo-google-fonts/bree-serif/400Regular';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faHouse, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// React Navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        drawerActiveBackgroundColor: '#E3E3E3',
        headerShown: false,
        drawerStyle:{
          borderColor: "#000000",
          borderWidth: 1,
          padding: 10,
        },
        drawerLabelStyle: {
          color: "#000000",
        }
      }}>

      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color }) => <FontAwesomeIcon size={20} icon={faHouse}/>,
        }}
      />
      
      <Drawer.Screen
        name="buddy"
        options={{
          title: 'Buddy Selection TEMP',
          drawerIcon: ({ color }) => <FontAwesomeIcon size={20} icon={faPaperPlane}/>,
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color }) => <FontAwesomeIcon size={20} icon={faGear}/>,
        }}
      />

    </Drawer>
  );

}