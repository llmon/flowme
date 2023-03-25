import { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { IconButton, TextInput, Surface, useTheme } from 'react-native-paper';
import Constants from 'expo-constants'
import { Context } from '../App';

export default function ({ navigation, route }) {
  const { nodeID } = route.params;
  const [data, setData] = useState([]);
  const [text, setText] = useState('');
  const { dispatch } = useContext(Context);
  const theme = useTheme();

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      if (route.params.parent === undefined) {
        return;
      }
      route.params.parent = undefined;
      e.preventDefault();
      navigation.dispatch(StackActions.popToTop());
    })
  }, [navigation, route.params])

  const send = (text) => {
    if (text.length !== 0) {
      const newData = [...data, { waterDrop: text }];
      dispatch({
        kind: 'update',
        payload: { nodeID, nodeValue: newData, parent: route.params.parent },
      });
      setData(newData);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Surface
            style={{
              ...styles.itemContainer,
              backgroundColor: theme.m3.colors.surfaceVariant,
            }}>
            <Text color={theme.m3.colors.onSurfaceVariant}>
              {item.waterDrop}
            </Text>
          </Surface>
        )}
        style={styles.flatList}
      />
      <TextInput
        value={text}
        onChangeText={setText}
        mode="outlined"
        right={
          <TextInput.Icon
            icon="send"
            disabled={text.length === 0}
            onPress={() =>
              send(text)
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingTop: Constants.statusBarHeight,
  },
  flatList: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  itemContainer: {
    alignSelf: 'flex-end',
    marginVertical: 4,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
