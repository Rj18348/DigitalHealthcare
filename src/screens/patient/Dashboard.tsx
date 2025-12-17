import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CATEGORIES = ["Cardiology", "Dental", "Neurology", "General"];

const PatientDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Hello, Rahim!</Text>
      <Text style={styles.subText}>Find your specialist today</Text>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Top Doctors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Doctors</Text>
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={styles.doctorCard}>
            <Image source={{ uri: 'https://picsum.photos/100' }} style={styles.docImg} />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.docName}>Dr. Sarah Johnson</Text>
              <Text style={styles.docSpec}>Heart Specialist</Text>
              <Text style={styles.rating}>⭐ 4.9 (120 Reviews)</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryChip: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  doctorCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  docImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  docName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  docSpec: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 14,
    color: '#FFA500',
  },
});

export default PatientDashboard;
