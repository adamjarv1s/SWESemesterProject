// all this does is get your IP address
import Constants from 'expo-constants';

const IP = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
export const IPAddress = `http://${IP}:8080`;