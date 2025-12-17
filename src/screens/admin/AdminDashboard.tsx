import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';

const AdminDashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Admin Panel</Text>

      <View style={styles.row}>
        <View style={styles.smallStatsBox}>
          <Text>Users</Text>
          <Text style={styles.bold}>1,240</Text>
        </View>
        <View style={styles.smallStatsBox}>
          <Text>Doctors</Text>
          <Text style={styles.bold}>85</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pending Verifications</Text>
      <View style={styles.doctorCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.docName}>Dr. Alan Turing</Text>
          <Text style={styles.docSpec}>License: #12345</Text>
        </View>
        <TouchableOpacity style={styles.btnVerify}>
          <Text style={{ color: '#fff' }}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallStatsBox: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.light.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  doctorCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  docName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  docSpec: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  btnVerify: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});

export default AdminDashboard;
