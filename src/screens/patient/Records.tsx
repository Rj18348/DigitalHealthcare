import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { auth, db } from '../../services/firebase'; // আপনার পাথ অনুযায়ী
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const RecordsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);

  // ১. Firestore থেকে রিয়েল-টাইমে রেকর্ডের লিস্ট নিয়ে আসা
  useEffect(() => {
    const q = query(
      collection(db, "MedicalRecords"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(docs);
    });

    return () => unsubscribe();
  }, []);

  // ২. ফাইল সিলেক্ট এবং আপলোড লজিক
  const pickAndUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], // শুধু PDF এবং ছবি সাপোর্ট করবে
      });

      if (!result.canceled) {
        setLoading(true);
        const { uri, name } = result.assets[0];

        // Firebase Storage-এ আপলোড করা
        const storage = getStorage();
        const fileRef = ref(storage, `medical_records/${auth.currentUser.uid}/${Date.now()}_${name}`);

        const response = await fetch(uri);
        const blob = await response.blob();
        await uploadBytes(fileRef, blob);

        // ফাইলের ডাউনলোড ইউআরএল নেওয়া
        const downloadURL = await getDownloadURL(fileRef);

        // Firestore-এ ডাটা সেভ করা
        await addDoc(collection(db, "MedicalRecords"), {
          userId: auth.currentUser.uid,
          fileName: name,
          fileUrl: downloadURL,
          uploadDate: serverTimestamp(),
          type: result.assets[0].mimeType
        });

        Alert.alert("Success", "File uploaded successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Upload failed: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Medical Records 💊</Text>

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 10 }} />}

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <MaterialCommunityIcons
              name={item.fileName.includes('.pdf') ? "file-pdf-box" : "image"}
              size={30} color="#007bff"
            />
            <View style={styles.recordInfo}>
              <Text style={styles.fileName} numberOfLines={1}>{item.fileName}</Text>
              <Text style={styles.fileDate}>Uploaded: {item.uploadDate?.toDate().toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Download", "Opening file...")}>
              <MaterialCommunityIcons name="download" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found. Upload your first report!</Text>}
      />

      {/* Floating Action Button for Upload */}
      <TouchableOpacity style={styles.fab} onPress={pickAndUploadDocument}>
        <MaterialCommunityIcons name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  recordCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2
  },
  recordInfo: { flex: 1, marginLeft: 15 },
  fileName: { fontSize: 16, fontWeight: '500' },
  fileDate: { fontSize: 12, color: 'gray' },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  }
});

export default RecordsScreen;
