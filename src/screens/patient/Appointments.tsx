import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const Appointments: React.FC = () => {
  const appointments = []; // Will be populated from Redux store

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No appointments scheduled</Text>
          <Text style={styles.emptySubtext}>Book your first appointment!</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.appointmentCard}>
              <Text style={styles.doctorName}>{item.doctorName}</Text>
              <Text style={styles.appointmentDate}>{item.date}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          )}
        />
      )}
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
    marginBottom: 20,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  status: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
    textTransform: 'uppercase',
  },
});

export default Appointments;
