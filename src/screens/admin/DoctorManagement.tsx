import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DoctorManagement: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Management</Text>
      <Text style={styles.subtitle}>Manage doctor registrations and approvals</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default DoctorManagement;
