import { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {
  IconButton,
  FAB,
  Card,
  Surface,
  Divider,
  Portal,
  Button,
  useTheme,
  Dialog,
} from 'react-native-paper';
import { Context } from '../App';
import CustomFAB from './CustomFAB';

export function formatDate(date) {
  const now = new Date();
  const result = `${date.month}月${date.day}日 ${date.hour}:${date.minutes < 10 ? '0' : ''
    }${date.minutes}`;

  if (now.getFullYear() === date.year) {
    return result;
  } else {
    return `${date.year}年` + result;
  }
}
function Star({ nodeID }) {
  const { state, dispatch } = useContext(Context);
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
              {item.moment !== undefined && item.image && (
                <Card.Cover source={item.image} />
              )}
              <Card.Title
                title={formatDate(item.created)}
                titleStyle={{ fontWeight: '500', fontSize: 11 }}
              />
              {item.moment !== undefined && item.text && (
                <Card.Content>
                  <Text>{item.text}</Text>
                </Card.Content>
              )}
              {item.moment === undefined && (
                <Card.Content>
                  <FlatList
                    data={item.nodeValue}
                    renderItem={({ item }) => (
                      <Surface
                        style={{
                          ...styles.itemContainer,
                          backgroundColor: theme.m3.colors.secondaryContainer,
                        }}>
                        <Text color={theme.m3.colors.onSecondaryContainer}>
                          {item.waterDrop}
                        </Text>
                      </Surface>
                    )}
                    style={styles.flatList}
                  />
                </Card.Content>
              )}
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
  flatList: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  itemContainer: {
    alignSelf: 'flex-end',
    marginVertical: 4,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 0,
  },
});
