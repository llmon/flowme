import { FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Context } from '../App';
import { StyleSheet } from 'react-native';

export default function (props) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { state, dispatch } = useContext(Context);

  return (
    <FAB
      icon="plus"
      color={theme.m3.colors.onPrimary}
      style={{ ...styles.fab, backgroundColor: theme.m3.colors.primary }}
      onPress={() => {
        const nodeID = state.nextID;
        dispatch({ kind: 'create' });
        navigation.navigate('Edit', {
          ...props,
          nodeID,
        });
      }}
      onLongPress={() => {
        const nodeID = state.nextID;
        dispatch({ kind: 'create' });
        navigation.navigate('Post', {
          ...props,
          nodeID,
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    marginRight: 16,
    marginBottom: 16,
    right: 0,
    bottom: 0,
  },
});
