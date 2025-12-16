import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

// Secure Storage Keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'userToken',
  USER_ID: 'userId',
  BIOMETRIC_ENABLED: 'biometricEnabled',
  ENCRYPTION_KEY: 'encryptionKey',
} as const;

// Secure Storage Operations
export class SecureStorage {
  static async saveAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      });
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw new Error('Failed to save authentication token');
    }
  }

  static async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  }

  static async saveUserId(userId: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, userId, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      });
    } catch (error) {
      console.error('Error saving user ID:', error);
      throw new Error('Failed to save user ID');
    }
  }

  static async getUserId(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      return null;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ID);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ENCRYPTION_KEY);
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }

  static async saveBiometricPreference(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.BIOMETRIC_ENABLED,
        JSON.stringify(enabled)
      );
    } catch (error) {
      console.error('Error saving biometric preference:', error);
    }
  }

  static async getBiometricPreference(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error retrieving biometric preference:', error);
      return false;
    }
  }
}

// Biometric Authentication
export class BiometricAuth {
  static async isBiometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  static async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Digital Healthcare',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  static async getBiometricTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting biometric types:', error);
      return [];
    }
  }
}

// Data Encryption Utilities (for sensitive medical data)
// IMPORTANT: This implementation uses basic encryption for demonstration.
// In production, use proper encryption libraries like crypto-js or expo-crypto
export class DataEncryption {
  private static generateKey(): string {
    // Generate a more secure key
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for environments without crypto API
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static async encryptData(data: string): Promise<string> {
    try {
      // WARNING: This is a basic implementation for demonstration only
      // In production, use AES-256-GCM encryption with proper key management
      // Consider using libraries like: expo-crypto, crypto-js, or react-native-aes-crypto

      const key = await this.getOrCreateEncryptionKey();
      // Convert to bytes for basic encryption
      const dataBytes = new TextEncoder().encode(data);
      const keyBytes = new TextEncoder().encode(key.slice(0, 16)); // Use first 16 chars

      let encrypted = '';
      for (let i = 0; i < dataBytes.length; i++) {
        encrypted += String.fromCharCode(
          dataBytes[i] ^ keyBytes[i % keyBytes.length]
        );
      }
      return btoa(encrypted);
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static async decryptData(encryptedData: string): Promise<string> {
    try {
      // WARNING: This is a basic implementation for demonstration only
      // In production, use proper decryption with the same algorithm as encryption

      const key = await this.getOrCreateEncryptionKey();
      const decoded = atob(encryptedData);
      const keyBytes = new TextEncoder().encode(key.slice(0, 16));

      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(
          decoded.charCodeAt(i) ^ keyBytes[i % keyBytes.length]
        );
      }
      return decrypted;
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  private static async getOrCreateEncryptionKey(): Promise<string> {
    try {
      let key = await SecureStore.getItemAsync(STORAGE_KEYS.ENCRYPTION_KEY);
      if (!key) {
        key = this.generateKey();
        await SecureStore.setItemAsync(STORAGE_KEYS.ENCRYPTION_KEY, key);
      }
      return key;
    } catch (error) {
      console.error('Error managing encryption key:', error);
      throw new Error('Failed to manage encryption key');
    }
  }
}

// HIPAA Compliance Helper Functions
export class HIPAACompliance {
  static validateDataAccess(userRole: string, requestedData: string, userId: string): boolean {
    // Implement role-based access control
    switch (userRole) {
      case 'patient':
        // Patients can only access their own data
        return requestedData.includes(userId);
      case 'doctor':
        // Doctors can access patient data they're assigned to
        return true; // Implement proper doctor-patient relationship check
      case 'admin':
        // Admins have broader access for platform management
        return true;
      default:
        return false;
    }
  }

  static logDataAccess(userId: string, action: string, resource: string): void {
    // Log all data access for audit trails
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      ipAddress: 'mobile_app', // In a real app, get actual IP
    };

    console.log('HIPAA Audit Log:', logEntry);
    // In production, send to secure logging service
  }

  static sanitizeDataForDisplay(data: any): any {
    // Remove or mask sensitive information not needed for display
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      // Remove sensitive fields like SSN, full credit card numbers, etc.
      delete sanitized.socialSecurityNumber;
      delete sanitized.fullCreditCardNumber;
      return sanitized;
    }
    return data;
  }
}
