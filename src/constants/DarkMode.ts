import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchDarkModeSetting = async () => {
  try {
    const storedDarkModeSetting = await AsyncStorage.getItem('isDarkMode');
    if (storedDarkModeSetting === 'true') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error fetching dark mode setting:', error);
    return false;
  }
};