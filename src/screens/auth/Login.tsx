import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { auth, db } from '../../services/firebase';
import { setUser } from '../../store/userSlice';
import { BiometricAuth, HIPAACompliance, SecureStorage } from '../../utils/security';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricPreference();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await BiometricAuth.isBiometricAvailable();
    setBiometricAvailable(available);
  };

  const loadBiometricPreference = async () => {
    const enabled = await SecureStorage.getBiometricPreference();
    setBiometricEnabled(enabled);
  };

  const handleBiometricToggle = async (value: boolean) => {
    setBiometricEnabled(value);
    await SecureStorage.saveBiometricPreference(value);
  };

  const handleBiometricLogin = async () => {
    const success = await BiometricAuth.authenticateWithBiometrics();
    if (success) {
      // Attempt login with stored credentials or just navigate
      // For now, show success message
      Alert.alert('Success', 'Biometric authentication successful!');
    } else {
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Store sensitive data securely
        await SecureStorage.saveAuthToken(await userCredential.user.getIdToken());
        await SecureStorage.saveUserId(userCredential.user.uid);

        // Log access for HIPAA compliance
        HIPAACompliance.logDataAccess(
          userCredential.user.uid,
          'LOGIN',
          'user_authentication'
        );

        dispatch(setUser({
          uid: userCredential.user.uid,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isLoggedIn: true,
          profileComplete: true,
        }));
      } else {
        Alert.alert('Error', 'User profile not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !name || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        id: userCredential.user.uid,
        email: email,
        name: name,
        phone: phone,
        role: role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Store sensitive data securely
      await SecureStorage.saveAuthToken(await userCredential.user.getIdToken());
      await SecureStorage.saveUserId(userCredential.user.uid);

      // Log access for HIPAA compliance
      HIPAACompliance.logDataAccess(
        userCredential.user.uid,
        'SIGNUP',
        'user_registration'
      );

      dispatch(setUser({
        uid: userCredential.user.uid,
        email: email,
        name: name,
        role: role,
        isLoggedIn: true,
        profileComplete: true,
      }));

      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Password is too weak');
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Healthcare</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Create a new account' : 'Sign in to your account'}
        </Text>
      </View>

      <View style={styles.form}>
        {isSignUp && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.roleSelector}>
              <Text style={styles.roleLabel}>I am a:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'patient' && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole('patient')}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === 'patient' && styles.roleButtonTextActive,
                    ]}
                  >
                    Patient
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'doctor' && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole('doctor')}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === 'doctor' && styles.roleButtonTextActive,
                    ]}
                  >
                    Doctor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}

        {!isSignUp && biometricAvailable && (
          <View style={styles.biometricSection}>
            <View style={styles.biometricRow}>
              <Text style={styles.biometricText}>Enable Biometric Login</Text>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={biometricEnabled ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            {biometricEnabled && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
              >
                <Text style={styles.biometricButtonText}>🔐 Login with Biometrics</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={isSignUp ? handleSignUp : handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.footerText}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={styles.footerLink}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleSelector: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  biometricSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  biometricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  biometricText: {
    fontSize: 16,
    color: '#333',
  },
  biometricButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  biometricButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default Login;
