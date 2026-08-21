'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { demoData as staticDemoData } from './data';
import { downloadAllDataForOffline } from './firestore';

// ─── Determine mode ───
// If Firebase env vars are set to real values, use Firestore.
// Otherwise fall back to demo data.
const isFirebaseConfigured =
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'safarnama-demo';

const DataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [data, setData] = useState(staticDemoData);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [mode, setMode] = useState(isFirebaseConfigured ? 'firestore' : 'demo');

  // ─── Firestore realtime subscriptions ───
  useEffect(() => {
    if (mode !== 'firestore') return;

    let unsubscribes = [];

    async function setupListeners() {
      try {
        const {
          collection, query, orderBy, onSnapshot, doc
        } = await import('firebase/firestore');
        const { db } = await import('./firebase');

        const listen = (collectionName, orderField, key) => {
          const ref = collection(db, collectionName);
          const q = orderField ? query(ref, orderBy(orderField)) : ref;

          const unsub = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            // Only overwrite if Firestore has data (don't blank out static fallback)
            if (docs.length > 0) {
              setData(prev => ({ ...prev, [key]: docs }));
            }
          }, (err) => {
            console.error(`Listener error for ${collectionName}:`, err);
          });

          unsubscribes.push(unsub);
        };

        // Listen to trip config
        const tripUnsub = onSnapshot(doc(db, 'config', 'trip'), (snap) => {
          if (snap.exists()) {
            setData(prev => ({ ...prev, trip: { id: snap.id, ...snap.data() } }));
          }
        });
        unsubscribes.push(tripUnsub);

        // Listen to all collections
        listen('itinerary', 'day', 'itinerary');
        listen('transport', 'date', 'transport');
        listen('hotels', 'checkIn', 'hotels');
        listen('places', 'name', 'places');
        listen('participants', 'name', 'participants');
        listen('announcements', 'time', 'announcements');
        listen('documents', 'date', 'documents');
        listen('photos', 'createdAt', 'photos');

        // Emergency (single doc)
        const emUnsub = onSnapshot(doc(db, 'emergencyContacts', 'main'), (snap) => {
          if (snap.exists()) {
            setData(prev => ({ ...prev, emergency: snap.data() }));
          }
        });
        unsubscribes.push(emUnsub);

      } catch (err) {
        console.error('Failed to setup Firestore listeners, falling back to demo:', err);
        setMode('demo');
      }
    }

    setupListeners();

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [mode]);

  // ─── Offline download ───
  const downloadForOffline = useCallback(async () => {
    setDownloadProgress('downloading');
    try {
      if (mode === 'firestore') {
        await downloadAllDataForOffline();
      }

      // Also cache the current data state in localStorage
      localStorage.setItem('safarnama_cached_data', JSON.stringify({
        data,
        cachedAt: new Date().toISOString(),
      }));

      // Register/update service worker cache
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_DATA',
          payload: data,
        });
      }

      setIsOfflineReady(true);
      setDownloadProgress('complete');
      setTimeout(() => setDownloadProgress(null), 2000);
    } catch (err) {
      console.error('Offline download failed:', err);
      setDownloadProgress('error');
      setTimeout(() => setDownloadProgress(null), 3000);
    }
  }, [data, mode]);

  // ─── Load cached data on mount (for offline) ───
  useEffect(() => {
    try {
      const cached = localStorage.getItem('safarnama_cached_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.data) {
          setIsOfflineReady(true);
          // Only use cached data if we're offline and not connected to Firestore
          if (!navigator.onLine && mode === 'demo') {
            setData(parsed.data);
          }
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, [mode]);

  // --- Calculate dynamic current day ---
  let finalTripData = { ...data.trip };
  if (finalTripData?.startDate) {
    const start = new Date(finalTripData.startDate);
    start.setHours(0, 0, 0, 0);
    const now = new Date();
    
    // For testing purposes, we can override the 'now' date if needed, but we'll use real time here
    now.setHours(0, 0, 0, 0);

    if (now >= start) {
      const diffTime = now.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      finalTripData.currentDay = Math.max(1, Math.min(diffDays, finalTripData.totalDays || 16));
    } else {
      // If trip hasn't started yet, default to Day 1
      finalTripData.currentDay = 1;
    }
  }

  const value = {
    ...data,
    trip: finalTripData,
    mode,
    isOfflineReady,
    downloadProgress,
    downloadForOffline,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
