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
      }}>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="select_profile" />
      <Stack.Screen name="acc_purpose" />
      <Stack.Screen name="acc_details" />
      <Stack.Screen name="comp_name" />
    </Stack>
  );
}
