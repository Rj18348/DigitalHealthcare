import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/userSlice';

const Profile: React.FC = () => {
  const { name, email, role } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { title: 'Edit Profile', icon: '👤' },
    { title: 'Medical History', icon: '📋' },
    { title: 'Insurance Info', icon: '🛡️' },
    { title: 'Settings', icon: '⚙️' },
    { title: 'Help & Support', icon: '❓' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#E3F2FD',
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    color: '#E3F2FD',
    textTransform: 'capitalize',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;
