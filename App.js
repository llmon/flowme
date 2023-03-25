import { useEffect, useState, createContext, useReducer } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  IconButton,
  Provider as PaperProvider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './components/Home';
import Edit from './components/Edit';
import Detail from './components/Detail'
import reducer from './reducer';
import {theme as paperTheme} from './theme'

export const Context = createContext(null);
const Stack = createNativeStackNavigator();

// read from storage
const initState = { nextID: 0, river: [] };
let didInit = false;

export default function () {
  const [theme, setTheme] = useState(paperTheme);
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (didInit) {
      return;
    }
    (async () => {
      let nextID = await AsyncStorage.getItem('nextID');
      if (nextID === null) {
        return;
      }
      nextID = JSON.parse(nextID);

      const river = [];
      for (let i = 0; i < nextID; i++) {
        const node = await AsyncStorage.getItem('node' + i);
        if (node !== null) {
          river.push(JSON.parse(node));
        }
      }
      dispatch({ kind: 'loaded', payload: { nextID, river } });
    })();
  }, []);
  return (
    <Context.Provider value={{ state, dispatch }}>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: 'flow',
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="Edit"
              component={Edit}
              options={{
                title: '',
              }}
            />
            <Stack.Screen
              name="Detail"
              component={Detail}
              options={{
                title: '',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Context.Provider>
  );
}
