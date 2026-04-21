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
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types';
import ProfilesScreen from '../index';
import AccPurposeScreen from '../createProfile/acc_purpose';
import AccDetailsScreen from '../createProfile/acc_details';
import CompDetailsScreen from '../createProfile/comp_name';
import SelectProfilesScreen from '../createProfile/select_profile';
import DashboardScreen from './dashboard';

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
          backgroundColor: '#FFFFFF',
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
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color }) => <FontAwesomeIcon size={20} icon={faGear}/>,
        }}
      />

    </Drawer>
  );

}