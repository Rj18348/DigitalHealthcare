import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, BackHandler, ToastAndroid, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { SecureStorage } from '../../src/utils/security';

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user);
  const lastBackPressed = useRef<number | null>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const now = Date.now();
      if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
        // Clear stored auth data before exiting to force fresh start on next launch
        SecureStorage.clearAll().then(() => {
          BackHandler.exitApp();
        }).catch((error) => {
          console.error('Error clearing storage on exit:', error);
          BackHandler.exitApp();
        });
        return true;
      }
      lastBackPressed.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      }
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name || 'User'}!</Text>
      <Text style={styles.subtitle}>Digital Healthcare Dashboard</Text>
      {/* Add your home screen content here */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
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
