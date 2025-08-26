import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My dashboard</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    
    paddingVertical: 8,
    alignSelf: 'flex-start',
    borderRadius: 24
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d2f1c6',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginHorizontal: 16
  },
});
