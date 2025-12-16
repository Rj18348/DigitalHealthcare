import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { Doctor, Appointment } from '../types';

// Zod validation schema
const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  appointmentDate: z.date().refine((date) => date > new Date(), 'Appointment date must be in the future'),
  appointmentType: z.enum(['consultation', 'follow-up', 'emergency']),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointmentType, setAppointmentType] = useState<'consultation' | 'follow-up' | 'emergency'>('consultation');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const doctorsQuery = query(collection(db, 'users'), where('role', '==', 'doctor'));
      const querySnapshot = await getDocs(doctorsQuery);
      const doctorsList: Doctor[] = [];
      querySnapshot.forEach((doc) => {
        doctorsList.push({ id: doc.id, ...doc.data() } as Doctor);
      });
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert('Error', 'Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !user) {
      Alert.alert('Error', 'Please select a doctor');
      return;
    }

    setLoading(true);
    try {
      const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId: user.id,
        doctorId: selectedDoctor,
        date: appointmentDate,
        duration: 30, // Default 30 minutes
        status: 'pending',
        type: appointmentType,
        notes,
      };

      await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      Alert.alert('Success', 'Appointment booked successfully!');
      // Reset form
      setSelectedDoctor('');
      setAppointmentDate(new Date());
      setAppointmentType('consultation');
      setNotes('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointmentDate(selectedDate);
    }
  };

  if (loadingDoctors) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Select Doctor</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDoctor}
            onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Choose a doctor..." value="" />
            {doctors.map((doctor) => (
              <Picker.Item
                key={doctor.id}
                label={`${doctor.name} - ${doctor.specialization}`}
                value={doctor.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Appointment Date & Time</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {appointmentDate.toLocaleDateString()} {appointmentDate.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={appointmentDate}
            mode="datetime"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Appointment Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={appointmentType}
            onValueChange={(value) => setAppointmentType(value)}
            style={styles.picker}
          >
            <Picker.Item label="Consultation" value="consultation" />
            <Picker.Item label="Follow-up" value="follow-up" />
            <Picker.Item label="Emergency" value="emergency" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={styles.textInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any additional notes..."
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.bookButton, loading && styles.disabledButton]}
        onPress={handleBookAppointment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BookAppointment;
