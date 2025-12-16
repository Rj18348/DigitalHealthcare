export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  experience: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: Date;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  type: 'prescription' | 'lab-report' | 'imaging' | 'note';
  title: string;
  data: any; // Encrypted data
  attachments?: string[]; // File URLs
  date: Date;
  createdAt: Date;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  method: 'card' | 'upi' | 'wallet';
  transactionId?: string;
  createdAt: Date;
}
