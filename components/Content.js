import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

function Bubble(props) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
}

export default function Content({ data }) {
  // pay attention to the attribute name, don't use key
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => {
        return <Bubble {...item} />;
      }}
      style={styles.container}
    />
  );
}

// TODO: use ThemeProvider's backgroundColor and color
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
  },
  bubble: {
    borderRadius: 14,
    backgroundColor: '#d3d3d3',
    overflow: 'hidden',
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
});
