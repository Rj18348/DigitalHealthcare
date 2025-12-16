import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  // Register for push notifications
  static async registerForPushNotificationsAsync(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return null;
      }

      // Get the token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push notification token:', token);

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  // Save push token to user profile
  static async savePushTokenToUser(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        pushToken: token,
        pushTokenPlatform: Platform.OS,
        pushTokenUpdatedAt: new Date(),
      });
      console.log('Push token saved to user profile');
    } catch (error) {
      console.error('Error saving push token to user:', error);
    }
  }

  // Send local notification (for in-app notifications)
  static async sendLocalNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Send appointment reminder (immediate notification)
  static async sendAppointmentReminder(
    appointmentId: string,
    doctorName: string,
    patientName?: string,
    minutesUntilAppointment: number = 60
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Appointment Reminder',
          body: `You have an appointment with ${doctorName} in ${minutesUntilAppointment} minutes${patientName ? ` for ${patientName}` : ''}`,
          data: { appointmentId, type: 'appointment_reminder' },
          sound: 'default',
          categoryIdentifier: 'appointment',
        },
        trigger: null, // Show immediately
      });

      console.log('Appointment reminder sent');
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
    }
  }

  // Cancel scheduled notification
  static async cancelScheduledNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log('Notification cancelled:', identifier);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Get all scheduled notifications
  static async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Handle notification response (when user taps on notification)
  static setupNotificationResponseHandler(
    handler: (response: Notifications.NotificationResponse) => void
  ): () => void {
    const subscription = Notifications.addNotificationResponseReceivedListener(handler);
    return () => subscription.remove();
  }

  // Handle incoming notifications
  static setupNotificationReceivedHandler(
    handler: (notification: Notifications.Notification) => void
  ): () => void {
    const subscription = Notifications.addNotificationReceivedListener(handler);
    return () => subscription.remove();
  }

  // Initialize notification categories (for interactive notifications)
  static async initializeNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('appointment', [
        {
          identifier: 'view',
          buttonTitle: 'View Details',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'snooze',
          buttonTitle: 'Remind Later',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('emergency', [
        {
          identifier: 'call',
          buttonTitle: 'Call Now',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'dismiss',
          buttonTitle: 'Dismiss',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    } catch (error) {
      console.error('Error setting up notification categories:', error);
    }
  }

  // Emergency notification
  static async sendEmergencyNotification(
    userId: string,
    title: string,
    message: string,
    priority: 'default' | 'high' = 'high'
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { userId, type: 'emergency', priority },
          sound: 'default',
          priority: priority === 'high' ? Notifications.AndroidNotificationPriority.HIGH : Notifications.AndroidNotificationPriority.DEFAULT,
          categoryIdentifier: 'emergency',
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error sending emergency notification:', error);
    }
  }
}

// Firebase Cloud Functions code (for backend implementation)
/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendAppointmentNotification = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointmentData = snap.data();
    const doctorId = appointmentData.doctorId;
    const patientId = appointmentData.patientId;

    // Get doctor details
    const doctorDoc = await admin.firestore().collection('users').doc(doctorId).get();
    const doctorData = doctorDoc.data();

    // Get patient details
    const patientDoc = await admin.firestore().collection('users').doc(patientId).get();
    const patientData = patientDoc.data();

    if (doctorData.pushToken) {
      const message = {
        notification: {
          title: 'New Appointment Request',
          body: `${patientData.name} has requested an appointment`,
        },
        data: {
          appointmentId: snap.id,
          type: 'appointment_request',
        },
        token: doctorData.pushToken,
      };

      return admin.messaging().send(message);
    }

    return null;
  });

exports.sendAppointmentStatusNotification = functions.firestore
  .document('appointments/{appointmentId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.status !== previousValue.status) {
      const patientId = newValue.patientId;
      const patientDoc = await admin.firestore().collection('users').doc(patientId).get();
      const patientData = patientDoc.data();

      if (patientData.pushToken) {
        const message = {
          notification: {
            title: 'Appointment Status Updated',
            body: `Your appointment status has been changed to: ${newValue.status}`,
          },
          data: {
            appointmentId: change.after.id,
            type: 'appointment_status_update',
          },
          token: patientData.pushToken,
        };

        return admin.messaging().send(message);
      }
    }

    return null;
  });
*/
