import React, { useEffect, useContext } from 'react';
import { View } from 'react-native';
import { IconButton, Card } from 'react-native-paper';
import Content from './Content';
import { Context } from '../App';

export default function Detail({ navigation, route }) {
  const { riverID } = route.params;
  const { state, dispatch } = useContext(Context);
  const river = state.sea.find((item) => item.riverID === riverID);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          disabled={river.river.length === 0}
          onPress={() => {
            const id = state.nextID;
            dispatch({ kind: 'new', parent: riverID });

            navigation.navigate('Edit', {
              riverID: id,
            });
          }}
        />
      ),
    });
  }, [navigation, state, dispatch, riverID, river]);

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
      <Card>
        <Card.Content>
          <Content data={river.river} />
        </Card.Content>
        <Card.Actions>
          <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <IconButton
              icon="home"
              onPress={() => {
                navigation.popToTop();
              }}
            />
            <IconButton
              icon="arrow-right"
              disabled={river.parent === undefined}
              onPress={() => {
                navigation.push('Detail', {
                  riverID: river.parent,
                });
              }}
            />
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
}
