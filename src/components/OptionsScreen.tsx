import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Define your stack param list

type OptionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Options'>;

const OptionsScreen = ({ navigation }: { navigation: OptionsScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.venueButton]}>
        <Text style={styles.buttonText}>Register Your Venue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  venueButton: {
    backgroundColor: '#34C759',
    marginTop: 20,
  },
});

export default OptionsScreen; 