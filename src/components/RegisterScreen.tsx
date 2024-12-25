import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          getCurrentLocation();
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to use this feature');
        }
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        try {
          // Using Google's Geocoding API to get readable address
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`
          );
          const data = await response.json();
          if (data.results && data.results[0]) {
            setFormData(prev => ({
              ...prev,
              address: data.results[0].formatted_address,
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              address: `Latitude: ${latitude}, Longitude: ${longitude}`,
            }));
          }
        } catch (error) {
          // Fallback to coordinates if geocoding fails
          setFormData(prev => ({
            ...prev,
            address: `Latitude: ${latitude}, Longitude: ${longitude}`,
          }));
        }
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Failed to get current location');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (formData.phone.length !== 11 || !/^\d+$/.test(formData.phone)) {
      Alert.alert('Error', 'Phone number must be 11 digits');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter your address or use current location');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission here
      console.log('Form submitted:', formData);
      Alert.alert('Success', 'Registration successful!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={text => setFormData(prev => ({...prev, name: text}))}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={text => setFormData(prev => ({...prev, email: text}))}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number (11 digits)"
        keyboardType="numeric"
        maxLength={11}
        value={formData.phone}
        onChangeText={text => setFormData(prev => ({...prev, phone: text}))}
      />

      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Address"
        multiline
        value={formData.address}
        onChangeText={text => setFormData(prev => ({...prev, address: text}))}
      />

      <TouchableOpacity
        style={styles.locationButton}
        onPress={requestLocationPermission}>
        <Text style={styles.locationButtonText}>Use Current Location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen; 