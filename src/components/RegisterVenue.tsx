import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterVenue = () => {
  const [formData, setFormData] = useState<{
    cnic: string;
    ownershipDoc: Asset | null;
    venueName: string;
    location: string;
    capacity: string;
    budget: string;
    venueImages: Asset[];
    venueType: string;
    availableDates: string[];
    availableTimeStart: Date;
    availableTimeEnd: Date;
  }>({
    cnic: '',
    ownershipDoc: null,
    venueName: '',
    location: '',
    capacity: '',
    budget: '',
    venueImages: [],
    venueType: 'indoor', // or 'outdoor'
    availableDates: [],
    availableTimeStart: new Date(),
    availableTimeEnd: new Date(),
  });
  

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);

  const pickImage = async (type: 'ownership' | 'venue') => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
      });
  
      // Use optional chaining and nullish coalescing to safely access assets
      const assets = result?.assets ?? [];
  
      if (assets.length > 0) {
        if (type === 'ownership') {
          setFormData(prev => ({
            ...prev,
            ownershipDoc: assets[0] as Asset,
          }));
        } else if (type === 'venue') {
          setFormData(prev => ({
            ...prev,
            venueImages: [...prev.venueImages, assets[0] as Asset],
          }));
        }
      } else {
        Alert.alert('No Image Selected', 'Please select an image.');
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Upload ownership document
      const ownershipUrl = await uploadImage(formData.ownershipDoc, 'ownership');
      
      // Upload venue images
      const venueUrls = await Promise.all(
        formData.venueImages.map(img => uploadImage(img, 'venue'))
      );

      // Save to Firestore
      await firestore().collection('Venues').add({
        CNIC: formData.cnic,
        OwnershipDocument: ownershipUrl,
        VenueName: formData.venueName,
        Location: formData.location,
        Capacity: formData.capacity,
        Budget: formData.budget,
        VenueImages: venueUrls,
        VenueType: formData.venueType,
        AvailableDates: formData.availableDates,
        AvailableTimeStart: formData.availableTimeStart.toISOString(),
        AvailableTimeEnd: formData.availableTimeEnd.toISOString(),
        CreatedAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Venue registered successfully!');
    } catch (error) {
      console.error('Venue registration error:', error);
      Alert.alert('Error', 'Failed to register venue');
    }
  };

  const uploadImage = async (
    image: Asset | null, // Accepts Asset or null
    type: 'ownership' | 'venue'
  ) => {
    if (!image || !image.uri) {
      console.warn('No valid image provided for upload.');
      return null;
    }
  
    try {
      const reference = storage().ref(
        `venues/${type}/${Date.now()}-${image.fileName || 'defaultName'}`
      );
      await reference.putFile(image.uri);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Image upload error:', error);
      throw error; // Re-throw for the calling function to handle
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Register Your Venue</Text>

      <TextInput
        style={styles.input}
        placeholder="CNIC (13 digits)"
        value={formData.cnic}
        onChangeText={text => setFormData(prev => ({...prev, cnic: text}))}
        keyboardType="numeric"
        maxLength={13}
      />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage('ownership')}>
        <Text style={styles.buttonText}>
          Upload Ownership Document
        </Text>
      </TouchableOpacity>

      {formData.ownershipDoc && (
        <Text style={styles.uploadedText}>Document uploaded ✓</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Venue Name"
        value={formData.venueName}
        onChangeText={text => setFormData(prev => ({...prev, venueName: text}))}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={text => setFormData(prev => ({...prev, location: text}))}
      />

      <TextInput
        style={styles.input}
        placeholder="Capacity"
        value={formData.capacity}
        onChangeText={text => setFormData(prev => ({...prev, capacity: text}))}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Budget"
        value={formData.budget}
        onChangeText={text => setFormData(prev => ({...prev, budget: text}))}
        keyboardType="numeric"
      />

      <View style={styles.venueTypeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            formData.venueType === 'indoor' && styles.selectedType,
          ]}
          onPress={() => setFormData(prev => ({...prev, venueType: 'indoor'}))}>
          <Text style={styles.typeText}>Indoor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            formData.venueType === 'outdoor' && styles.selectedType,
          ]}
          onPress={() => setFormData(prev => ({...prev, venueType: 'outdoor'}))}>
          <Text style={styles.typeText}>Outdoor</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage('venue')}>
        <Text style={styles.buttonText}>Upload Venue Images</Text>
      </TouchableOpacity>

      {formData.venueImages.length > 0 && (
        <Text style={styles.uploadedText}>
          {formData.venueImages.length} images uploaded
        </Text>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register Venue</Text>
      </TouchableOpacity>
    </ScrollView>
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
  uploadButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadedText: {
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 15,
  },
  venueTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  selectedType: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RegisterVenue; 