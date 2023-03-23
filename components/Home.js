import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Button, IconButton, Card, Dialog, Portal } from 'react-native-paper';
import Content from './Content';
import { Context } from '../App';

export default function Home({ navigation }) {
  const { state, dispatch } = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [deleteID, setDeleteID] = useState(-1);
  const hideDialog = () => {
    setVisible(false);
    setDeleteID(-1);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          onPress={() => {
            const id = state.nextID;
            dispatch({ kind: 'new' });

            navigation.navigate('Edit', {
              riverID: id,
            });
          }}
        />
      ),
    });
  }, [navigation, state, dispatch]);

  if (state.sea.length === 0) {
    return <View />;
  }

  const displayed = state.sea.filter(
    (river) =>
      state.sea.find((item) => item.parent === river.riverID) === undefined
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={displayed.reverse()}
        renderItem={({ item }) => {
          return (
            <Card
              style={styles.card}
              onPress={() => {
                navigation.navigate('Detail', {
                  riverID: item.riverID,
                });
              }}
              onLongPress={() => {
                setVisible(true);
                setDeleteID(item.riverID);
              }}>
              <Card.Title title={item.created} titleStyle={styles.cardTitle} />
              <Card.Content>
                <Content data={item.river} />
              </Card.Content>
            </Card>
          );
        }}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{'确认删除?'}</Dialog.Title>
          <Dialog.Actions>
            <Button
              onPress={() => {
                dispatch({ kind: 'delete', riverID: deleteID });
                hideDialog();
              }}>
              {'是'}
            </Button>
            <Button onPress={hideDialog}>{'否'}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  card: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 10,
  },
});
