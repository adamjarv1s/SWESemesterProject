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
      <Stack.Screen name="dashboard" options={{}} />
      <Stack.Screen name="index" options={{}} />
    </Stack>
  );
}
