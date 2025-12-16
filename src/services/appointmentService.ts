import { db } from './firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { Appointment } from '../types';

export class AppointmentService {
  // Real-time listener for appointments
  static listenToAppointments(
    userId: string,
    role: 'patient' | 'doctor' | 'admin',
    callback: (appointments: Appointment[]) => void
  ) {
    // Build query based on user role
    let q;

    if (role === 'patient') {
      // Patients see their own appointments
      q = query(
        collection(db, 'appointments'),
        where('patientId', '==', userId),
        orderBy('date', 'desc')
      );
    } else if (role === 'doctor') {
      // Doctors see appointments assigned to them
      q = query(
        collection(db, 'appointments'),
        where('doctorId', '==', userId),
        orderBy('date', 'desc')
      );
    } else {
      // Admins can see recent appointments (limited for performance)
      q = query(
        collection(db, 'appointments'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
    }

    return onSnapshot(q, (snapshot) => {
      const appointments: Appointment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
      })) as Appointment[];

      callback(appointments);
    }, (error) => {
      console.error('Error listening to appointments:', error);
    });
  }

  // Create new appointment
  static async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Log the creation for audit trail
      await this.logAppointmentActivity(docRef.id, 'CREATED', appointmentData.patientId);

      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  }

  // Update appointment status
  static async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status'],
    updatedBy: string
  ): Promise<void> {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status,
        updatedAt: new Date(),
      });

      // Log the status change
      await this.logAppointmentActivity(appointmentId, `STATUS_CHANGED_${status.toUpperCase()}`, updatedBy);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw new Error('Failed to update appointment');
    }
  }

  // Get appointment details
  static async getAppointmentDetails(appointmentId: string): Promise<Appointment | null> {
    try {
      const appointmentDoc = await getDocs(query(collection(db, 'appointments'), where('__name__', '==', appointmentId)));
      if (!appointmentDoc.empty) {
        const data = appointmentDoc.docs[0].data();
        return {
          id: appointmentDoc.docs[0].id,
          ...data,
          date: data.date?.toDate?.() || new Date(data.date),
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
        } as Appointment;
      }
      return null;
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      return null;
    }
  }

  // Get upcoming appointments for a user
  static async getUpcomingAppointments(userId: string, role: 'patient' | 'doctor'): Promise<Appointment[]> {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'appointments'),
        where(role === 'patient' ? 'patientId' : 'doctorId', '==', userId),
        where('date', '>=', now),
        where('status', 'in', ['pending', 'confirmed']),
        orderBy('date', 'asc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
      })) as Appointment[];
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return [];
    }
  }

  // Private method to log appointment activities
  private static async logAppointmentActivity(
    appointmentId: string,
    action: string,
    performedBy: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, 'auditLogs'), {
        appointmentId,
        action,
        performedBy,
        timestamp: new Date(),
        resource: 'appointment',
      });
    } catch (error) {
      console.error('Error logging appointment activity:', error);
    }
  }
}
