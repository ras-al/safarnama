'use client';
import { useState, useEffect } from 'react';
import {
  collection, doc, onSnapshot, query, orderBy,
  addDoc, updateDoc, deleteDoc, serverTimestamp,
  getDocs, writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Generic realtime collection hook ───
export function useCollection(collectionName, orderField = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = collection(db, collectionName);
    const q = orderField ? query(ref, orderBy(orderField)) : ref;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(`Firestore error on ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, orderField]);

  return { data, loading, error };
}

// ─── Generic realtime document hook ───
export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) { setLoading(false); return; }

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Firestore doc error:`, err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading };
}

// ─── CRUD operations ───
export async function addDocument(collectionName, data) {
  const ref = collection(db, collectionName);
  return addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocument(collectionName, docId, data) {
  const ref = doc(db, collectionName, docId);
  return updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName, docId) {
  const ref = doc(db, collectionName, docId);
  return deleteDoc(ref);
}

// ─── Specific collection hooks with proper ordering ───
export function useItinerary() {
  return useCollection('itinerary', 'day');
}

export function useTransport() {
  return useCollection('transport', 'date');
}

export function useHotels() {
  return useCollection('hotels', 'checkIn');
}

export function usePlaces() {
  return useCollection('places', 'name');
}

export function useParticipants() {
  return useCollection('participants', 'name');
}

export function useAnnouncements() {
  return useCollection('announcements', 'time');
}

export function useEmergencyContacts() {
  return useCollection('emergencyContacts');
}

export function useDocuments() {
  return useCollection('documents', 'date');
}

export function usePhotos() {
  return useCollection('photos', 'createdAt');
}

export function useTripConfig() {
  return useDocument('config', 'trip');
}

// ─── Offline data download ───
export async function downloadAllDataForOffline() {
  const collections = [
    'itinerary', 'transport', 'hotels', 'places',
    'participants', 'announcements', 'emergencyContacts',
    'documents', 'config'
  ];

  const results = {};

  for (const name of collections) {
    try {
      const snapshot = await getDocs(collection(db, name));
      results[name] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error(`Failed to download ${name}:`, err);
      results[name] = [];
    }
  }

  // Also cache in localStorage as a fallback
  try {
    localStorage.setItem('safarnama_offline_data', JSON.stringify({
      ...results,
      downloadedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }

  return results;
}

// ─── Seed demo data to Firestore ───
export async function seedDemoData(demoData) {
  const batch = writeBatch(db);

  // Trip config
  const tripRef = doc(db, 'config', 'trip');
  batch.set(tripRef, demoData.trip);

  await batch.commit();

  // Itinerary
  for (const day of demoData.itinerary) {
    await addDoc(collection(db, 'itinerary'), day);
  }

  // Transport
  for (const t of demoData.transport) {
    await addDoc(collection(db, 'transport'), t);
  }

  // Hotels
  for (const h of demoData.hotels) {
    await addDoc(collection(db, 'hotels'), h);
  }

  // Places
  for (const p of demoData.places) {
    await addDoc(collection(db, 'places'), p);
  }

  // Participants
  for (const p of demoData.participants) {
    await addDoc(collection(db, 'participants'), p);
  }

  // Announcements
  for (const a of demoData.announcements) {
    await addDoc(collection(db, 'announcements'), a);
  }

  // Emergency
  const emRef = doc(db, 'emergencyContacts', 'main');
  await updateDoc(emRef, demoData.emergency).catch(() => {
    const ref2 = doc(db, 'emergencyContacts', 'main');
    return addDoc(collection(db, 'emergencyContacts'), demoData.emergency);
  });
}
