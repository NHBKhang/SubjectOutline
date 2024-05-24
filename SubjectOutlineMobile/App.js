import React, { useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';
import { theme } from './src/core/theme';
import UserReducer from './src/configs/Reducer';
import Context from './src/configs/Context';
import Main from './src/Main';
import { AuthStack, IntroStack } from './src/Stack';

const Stack = createStackNavigator();

export default function App() {
  const [user, dispatch] = useReducer(UserReducer, null);

  return (
    <Context.Provider value={[user, dispatch]}>
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="AuthStack" component={AuthStack}
              options={{
                headerShown: false
              }} />

            <Stack.Screen name="Main" component={Main}
              options={{
                headerShown: false
              }} />

            <Stack.Screen name="IntroStack" component={IntroStack}
              options={{
                headerMode: 'none'
              }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </Context.Provider>
  );
}