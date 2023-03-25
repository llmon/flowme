import { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Surface, useTheme, FAB } from 'react-native-paper';
import { Context } from '../App';

import { formatDate } from './Home';

export default function ({ navigation, route }) {
  const { nodeID } = route.params;
  const { state, dispatch } = useContext(Context);
  const theme = useTheme();

  const data = useMemo(() => {
    const data = [];
    let id = nodeID;
    let node = state.river.find((item) => item.nodeID === id);
    while (node !== undefined) {
      data.push(node);
      id = node.parent;
      node = state.river.find((item) => item.nodeID === id);
    }
    return data;
  }, [state.river, nodeID]);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card
              onPress={() => {
                if (item.nodeID !== nodeID) {
                  navigation.push('Detail', {
                    nodeID: item.nodeID,
                  });
                }
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
            </Card>
          )}
          style={{ flex: 1 }}
        />
      </View>
      <FAB
        icon="plus"
        color={theme.m3.colors.onPrimary}
        style={{ ...styles.fab, backgroundColor: theme.m3.colors.primary }}
        onPress={() => {
          const id = state.nextID;
          dispatch({ kind: 'create' });
          navigation.navigate('Edit', {
            nodeID: id,
            parent: nodeID,
          });
        }}
        onLongPress={() => {
          const id = state.nextID;
          dispatch({ kind: 'create' });
          navigation.navigate('Post', {
            nodeID: id,
            parent: nodeID,
          });
        }}
      />
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
  fab: {
    position: 'absolute',
    marginRight: 16,
    marginBottom: 16,
    right: 0,
    bottom: 0,
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
