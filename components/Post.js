import { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  IconButton,
  Card,
  Button,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { Context } from '../App'

export default function Post({ navigation, route }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState('');
  const theme = useTheme();
  const { dispatch } = useContext(Context);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="outlined"
          style={{ marginRight: 16 }}
          onPress={() => {
            dispatch({
              kind: 'update',
              payload: {
                ...route.params,
                text,
                image: selectedImage,
                moment: true,
              },
            });
            navigation.navigate('Home');
          }}>
          {'发送'}
        </Button>
      ),
    });
  }, [navigation, text, selectedImage, route.params, dispatch]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="这一刻的想法"
        multiline
        style={{ marginVertical: 16 }}
      />
      {!selectedImage && (
        <IconButton
          icon="plus"
          size={48}
          color={theme.m3.colors.onPrimaryContainer}
          onPress={pickImageAsync}
          style={{
            backgroundColor: theme.m3.colors.primaryContainer,
            alignSelf: 'center',
          }}
        />
      )}
      {selectedImage && (
        <Card>
          <Card.Cover source={{ uri: selectedImage }} />
        </Card>
      )}
      {selectedImage && (
        <IconButton
          icon="image-remove"
          size={48}
          color={theme.m3.colors.onErrorContainer}
          onPress={() => {
            setSelectedImage(null);
          }}
          style={{
            backgroundColor: theme.m3.colors.errorContainer,
            alignSelf: 'center',
          }}
        />
      )}
    </View>
  );
}
