import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WishlistScreen from './src/screens/WishtList/WishlistScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const linking = {
  prefixes: ["centscape://"], // custom scheme
  config: {
    screens: {
      Wishlist: "add", // open Wishlist when path is /add
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer linking={linking}>
          <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Wishlist" component={WishlistScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
