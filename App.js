import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './components/Home';
import Edit from './components/Edit';
import Detail from './components/Detail';

const initState = { sea: [], nextID: 0 };

// sea <- river <- waterDrop
function reducer(state, action) {
  const saveRiver = async (id, river) => {
    const jsonValue = JSON.stringify(river);
    await AsyncStorage.setItem('river' + id, jsonValue);
  };
  const saveNextId = async (nextID) => {
    const val = JSON.stringify(nextID);
    await AsyncStorage.setItem('nextID', val);
  };
  switch (action.kind) {
    case 'loaded': {
      if (action.sea !== undefined && action.nextID !== undefined) {
        return { sea: action.sea, nextID: action.nextID };
      } else {
        return initState;
      }
    }
    case 'new': {
      const id = state.nextID;
      const now = new Date();

      const newState = {
        sea: [
          ...state.sea,
          {
            riverID: id,
            river: [],
            created: now.toLocaleString('zh-CN'),
          },
        ],
        nextID: state.nextID + 1,
      };
      if (action.parent !== undefined) {
        newState.sea[newState.sea.length - 1].parent = action.parent;
      }
      saveNextId(newState.nextID);
      saveRiver(id, newState.sea[newState.sea.length - 1]);
      return newState;
    }
    case 'send': {
      // TODO: it may break
      const editing = {
        ...state.sea[state.sea.length - 1],
      };
      editing.river.push({ text: action.text });
      saveRiver(action.riverID, editing);
      const newState = {
        ...state,
        sea: state.sea.slice(),
      };
      newState.sea[newState.sea.length - 1] = editing;
      return newState;
    }
    case 'delete': {
      AsyncStorage.removeItem('river' + action.riverID);
      return {
        ...state,
        sea: state.sea.filter((item) => item.riverID !== action.riverID),
      };
    }
  }
}

export const Context = createContext(null);
const Stack = createNativeStackNavigator();

export default function () {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    (async () => {
      let nextID = await AsyncStorage.getItem('nextID');
      if (nextID === null) {
        dispatch({ kind: 'loaded' });
        return;
      }
      nextID = JSON.parse(nextID);

      const sea = [];
      for (let i = 0; i < nextID; i++) {
        const river = await AsyncStorage.getItem('river' + i);
        if (river !== null) {
          sea.push(JSON.parse(river));
        }
      }
      dispatch({ kind: 'loaded', sea, nextID });
    })();
  }, []);
  return (
    <Context.Provider value={{ state, dispatch }}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={() => ({
                title: 'flowme',
                headerRight: () => <IconButton icon="plus" />,
              })}
            />
            <Stack.Screen
              name="Edit"
              component={Edit}
              options={() => ({
                title: '',
              })}
            />
            <Stack.Screen
              name="Detail"
              component={Detail}
              options={() => ({
                title: '',
                headerRight: () => <IconButton icon="plus" disabled />,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Context.Provider>
  );
}
