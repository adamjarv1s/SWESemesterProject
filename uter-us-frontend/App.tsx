// React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';
import ProfilesScreen from './screens/profiles';
import AccPurposeScreen from './screens/acc_purpose';
import AccDetailsScreen from './screens/acc_details';
import CompDetailsScreen from './screens/comp_name';
import DashboardScreen from './screens/dashboard';

const Stack = createNativeStackNavigator<RootStackParamList>();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profiles" screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Profiles" component={ProfilesScreen} />
        <Stack.Screen name="AccPurpose" component={AccPurposeScreen} />
        <Stack.Screen name="AccDetails" component={AccDetailsScreen} />
        <Stack.Screen name="CompName" component={CompDetailsScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;