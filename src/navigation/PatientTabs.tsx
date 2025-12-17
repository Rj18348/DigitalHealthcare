import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// স্ক্রিনগুলো ইমপোর্ট
import PatientDashboard from '../screens/patient/Dashboard';
import AppointmentScreen from '../screens/patient/Appointments';
import RecordsScreen from '../screens/patient/Records';
import SettingsScreen from '../screens/patient/Settings';

// AlertsScreen যদি এখনও না বানিয়ে থাকেন, তবে একটি টেম্পোরারি কম্পোনেন্ট দিয়ে রাখছি
const PlaceholderAlerts = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>🔔 No new alerts!</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const PatientTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: string = 'help-circle-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar-check' : 'calendar-check-outline';
          } else if (route.name === 'Records') {
            iconName = focused ? 'file-medical' : 'file-medical-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'bell' : 'bell-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 70, // উচ্চতা কিছুটা বাড়ানো হয়েছে যাতে দেখতে সুন্দর লাগে
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0'
        },
        headerShown: true,
        headerStyle: { backgroundColor: '#f8f9fa' },
        headerTitleAlign: 'center', // টাইটেল মাঝখানে রাখার জন্য
      })}
    >
      <Tab.Screen
        name="Home"
        component={PatientDashboard}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen
        name="Records"
        component={RecordsScreen}
        options={{ title: 'Records' }}
      />
      <Tab.Screen
        name="Alerts"
        component={PlaceholderAlerts} // এখানে আপনার AlertsScreen দিন
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default PatientTabs;
