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

// constants
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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

export default function TabTwoScreen() {
  return (
    <View>
    <Pressable style={styles.buttonContainer} onPress={printAllData}>
      <ThemedText style={styles.buttonText}>Print All Data</ThemedText>
    </Pressable>

    <Pressable
      style={styles.buttonContainer}
      onPress={() => {
        if (Platform.OS === 'web') {
          const confirmed = window.confirm(
            "Are you sure you want to delete ALL your data? This cannot be undone."
          );
          if (confirmed) deleteAllData();
        } else {
          Alert.alert(
            "Delete All Data",
            "Are you sure you want to delete ALL your data? This cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: deleteAllData },
            ]
          );
        }
      }}
    >
      <ThemedText style={styles.buttonText}>Delete All Data</ThemedText>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
