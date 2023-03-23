import React, { useState, useContext} from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import Content from './Content';
import { Context } from '../App';

export default function Edit({ navigation, route }) {
  const { riverID } = route.params;
  const { state, dispatch } = useContext(Context);
  const [text, setText] = useState('');

  // invariant: must be the last element of the sea when editing
  // but if we allowed to modify river in the past, this will break
  const river = state.sea[state.sea.length - 1]
  return (
    <View style={styles.editContainer}>
      <Content data={river.river} />
      <TextInput
        value={text}
        onChangeText={setText}
        mode="outlined"
        right={
          <TextInput.Icon
            icon="send"
            disabled={text.length === 0}
            onPress={() => {
              if (text.length !== 0) {
                dispatch({ kind: 'send', text: text, riverID: riverID });
                setText('');
              }
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
