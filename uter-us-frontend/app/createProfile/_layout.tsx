import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          
        },
        //headerShown: false,
      }}>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="select_profile" options={{title: "Select Account", headerShown: false}}/>
      <Stack.Screen name="acc_purpose" options={{title: "Account Purpose"}}/>
      <Stack.Screen name="acc_details" options={{title: "Account Details"}}/>
      <Stack.Screen name="comp_name" options={{title: "Select Companion"}}/>
    </Stack>
  );
}
