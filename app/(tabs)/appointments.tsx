import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      <Text style={styles.subtitle}>Your scheduled appointments will appear here</Text>
      {/* Add your appointments screen content here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
