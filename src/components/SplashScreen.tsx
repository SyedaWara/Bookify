import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.jpg')} // Make sure to add your logo file
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: "100%", // Adjust size as needed
    height: "100%", // Adjust size as needed
  },
});

export default SplashScreen; 