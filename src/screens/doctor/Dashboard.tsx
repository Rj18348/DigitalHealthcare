import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DoctorDashboard: React.FC = () => {
  const stats = [
    { title: 'Today\'s Appointments', value: '8', color: '#007AFF' },
    { title: 'Pending Reviews', value: '12', color: '#FF9500' },
    { title: 'This Month', value: '156', color: '#34C759' },
  ];

  const quickActions = [
    { title: 'View Schedule', icon: '📅' },
    { title: 'Patient Records', icon: '📋' },
    { title: 'Write Prescription', icon: '💊' },
    { title: 'Emergency', icon: '🚨' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Doctor Dashboard</Text>
        <Text style={styles.subtitle}>Manage your practice efficiently</Text>
      </View>

      <View style={styles.stats}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
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
  stats: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quickActions: {
    padding: 20,
    paddingTop: 0,
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
});

export default DoctorDashboard;
