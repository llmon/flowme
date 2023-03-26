import { Card, Surface, useTheme } from 'react-native-paper'
import { Text, FlatList, StyleSheet } from 'react-native'


function formatDate(date) {
  const now = new Date();
  const result = `${date.month}月${date.day}日 ${date.hour}:${date.minutes < 10 ? '0' : ''
    }${date.minutes}`;

  if (now.getFullYear() === date.year) {
    return result;
  } else {
    return `${date.year}年` + result;
  }
}

export default function ({ item }) {
  const theme = useTheme();
  return (
    <>
      {item.moment !== undefined && item.image && (
        <Card.Cover source={{ uri: item.image }} />
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
    </>
  );
}

const styles = StyleSheet.create({
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
})
