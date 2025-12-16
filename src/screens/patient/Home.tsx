import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PatientHome: React.FC = () => {
  const navigation = useNavigation();

  const quickActions = [
    {
      title: 'Book Appointment',
      icon: '📅',
      action: () => navigation.navigate('BookAppointment' as never),
    },
    {
      title: 'My Records',
      icon: '📋',
      action: () => navigation.navigate('MedicalRecords' as never),
    },
    {
      title: 'Find Doctors',
      icon: '👨‍⚕️',
      action: () => navigation.navigate('DoctorList' as never),
    },
    {
      title: 'Emergency',
      icon: '🚨',
      action: () => navigation.navigate('Emergency' as never),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to Digital Healthcare</Text>
        <Text style={styles.subtitle}>Your health, our priority</Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.action}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.upcomingSection}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <View style={styles.upcomingCard}>
          <Text style={styles.noAppointments}>No upcoming appointments</Text>
          <Text style={styles.bookPrompt}>Book your first appointment today!</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  upcomingSection: {
    padding: 20,
    paddingTop: 0,
  },
  upcomingCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  noAppointments: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  bookPrompt: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default PatientHome;
