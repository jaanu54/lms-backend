import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  useEffect(() => {
    // Preload icons
    Icon.loadFont();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
