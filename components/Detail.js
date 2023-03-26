import { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Surface, useTheme, FAB } from 'react-native-paper';
import { Context } from '../App';
import CustomFAB from './CustomFAB';
import CustomCardContent from './CustomCardContent';


export default function ({ navigation, route }) {
  const { nodeID } = route.params;
  const { state } = useContext(Context);
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
              <CustomCardContent item={item} />
            </Card>
          )}
          style={{ flex: 1 }}
        />
      </View>
      <CustomFAB parent={nodeID} />
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
