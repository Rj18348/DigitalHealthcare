import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'medicine' | 'appointment' | 'system';
  isRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Medicine Reminder 💊',
    description: 'It\'s time to take your Paracetamol 500mg after lunch.',
    time: '2 mins ago',
    type: 'medicine',
    isRead: false,
  },
  {
    id: '2',
    title: 'Appointment Confirmed ✅',
    description: 'Dr. Sarah Johnson has confirmed your appointment for tomorrow at 10:30 AM.',
    time: '1 hour ago',
    type: 'appointment',
    isRead: false,
  },
  {
    id: '3',
    title: 'Lab Report Ready 📄',
    description: 'Your blood test report is now available in the Records section.',
    time: '5 hours ago',
    type: 'system',
    isRead: true,
  },
];

const AlertsScreen: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'medicine': return { name: 'pill', color: '#FF6B6B' };
      case 'appointment': return { name: 'calendar-check', color: '#4ECDC4' };
      default: return { name: 'information-variant', color: '#45B7D1' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const icon = getIcon(item.type);
          return (
            <TouchableOpacity style={[styles.card, !item.isRead && styles.unreadCard]}>
              <View style={[styles.iconBg, { backgroundColor: icon.color + '20' }]}>
                <MaterialCommunityIcons name={icon.name as any} size={24} color={icon.color} />
              </View>
              <View style={styles.content}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              {!item.isRead && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  markRead: { color: '#007bff', fontWeight: '500' },
  card: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 16, marginBottom: 12, padding: 15, borderRadius: 12, alignItems: 'center' },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: '#007bff' },
  iconBg: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 2 },
  timeText: { fontSize: 12, color: '#999', marginTop: 5 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#007bff' }
});

export default AlertsScreen;
