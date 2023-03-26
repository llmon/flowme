import { useContext, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  IconButton,
  Card,
  Divider,
  Portal,
  Button,
  useTheme,
  Dialog,
} from 'react-native-paper';
import { Context } from '../App';
import CustomFAB from './CustomFAB';
import CustomCardContent from './CustomCardContent';

function Star({ nodeID }) {
  const { dispatch } = useContext(Context);
  const theme = useTheme();

  return (
    <IconButton
      icon="heart"
      color={theme.m3.colors.tertiaryContainer}
      onPress={() => {
        dispatch({ kind: 'star', payload: { nodeID, star: false } });
      }}
    />
  );
}

export default function Home({ navigation }) {
  const { state, dispatch } = useContext(Context);
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [deleteID, setDeleteID] = useState(-1);
  const hideDialog = () => {
    setVisible(false);
    setDeleteID(-1);
  };

  const data = state.river.filter(
    (node) =>
      state.river.find((item) => item.parent === node.nodeID) === undefined
  );
  data.reverse();

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card
              onPress={() => {
                navigation.navigate('Detail', {
                  nodeID: item.nodeID,
                });
              }}
              onLongPress={() => {
                setVisible(true);
                setDeleteID(item.nodeID);
              }}
              style={{ marginVertical: 4 }}>
              <CustomCardContent item={item} />
              <Divider />
              <Card.Actions style={{ justifyContent: 'space-between' }}>
                <IconButton
                  icon="comment-outline"
                  onPress={() => {
                    const nodeID = state.nextID;
                    dispatch({ kind: 'create' });
                    navigation.navigate('Edit', {
                      nodeID,
                      parent: item.nodeID,
                    });
                  }}
                />
                {item.star ? (
                  <Star nodeID={item.nodeID} />
                ) : (
                  <IconButton
                    icon="heart-outline"
                    color={theme.m3.colors.secondary}
                    onPress={() => {
                      dispatch({
                        kind: 'star',
                        payload: { nodeID: item.nodeID, star: true },
                      });
                    }}
                  />
                )}
              </Card.Actions>
            </Card>
          )}
          style={{ flex: 1 }}
        />
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{'确认删除?'}</Dialog.Title>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  dispatch({ kind: 'delete', payload: { nodeID: deleteID } });
                  hideDialog();
                }}>
                {'是'}
              </Button>
              <Button onPress={hideDialog}>{'否'}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      <CustomFAB />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginVertical: 4,
  },
});
