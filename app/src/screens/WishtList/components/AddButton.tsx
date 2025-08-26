import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const AddButton = ({ setAdding }: { setAdding: (value: boolean) => void }) => {
  return (
    <TouchableOpacity
      accessibilityLabel="add-button"
      onPress={() => setAdding(true)}
      style={styles.container}
    >
      <View style={styles.buttonContainer}>
        <Text style={styles.plusIconText}>+</Text>
        <Text style={styles.buttonText}>
          Add items to your Centscape wishlist
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  plusIconText: {
    color: '#d5f2ca',
    fontSize: 28,
    fontWeight: 'bold',
    
  },
  buttonText: {
    color: '#d5f2ca',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#000',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8
    // marginTop: 16,
  },
});
