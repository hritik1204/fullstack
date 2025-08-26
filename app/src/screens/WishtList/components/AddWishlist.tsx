import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const AddWishlist = ({
  url,
  setUrl,
  mutation,
}: {
  url: string;
  setUrl: (value: string) => void;
  mutation: any;
}) => {
  return (
    <View>
      <TextInput
        accessibilityLabel="url-input"
        placeholder="Paste URL"
        value={url}
        onChangeText={setUrl}
        style={styles.textInput}
      />
      <TouchableOpacity
        onPress={() => {
          if(!url) return alert('Enter an Url')
          mutation.mutate(url);
        }}
        accessibilityLabel="save-button"
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      {mutation.isPending && <ActivityIndicator />}
      {mutation.isError && (
        <Text style={styles.errorText}>
          {(mutation.error as Error).message}
        </Text>
      )}
    </View>
  );
};

export default AddWishlist;

const styles = StyleSheet.create({
  container: {},
  buttonText: {
    color: '#d5f2ca',
    fontSize: 16,
    fontWeight: 'bold',
    includeFontPadding: false,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    includeFontPadding: false,
  },
  buttonContainer: {
    borderRadius: 50,
    backgroundColor: '#000',

    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  textInput: { borderWidth: 1, padding: 10, marginHorizontal: 8 },
});
