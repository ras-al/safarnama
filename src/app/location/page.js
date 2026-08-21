'use client';
import { useAppData } from '@/lib/DataProvider';
import { MapPin, User, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function UserLocation() {
  const { participants } = useAppData();
  const [activeLocations, setActiveLocations] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locs = {};
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d.active && new Date(d.expiresAt) > new Date()) {
          locs[d.name] = d;
        }
      });
      setActiveLocations(locs);
    });
    return () => unsub();
  }, []);

  // Sort participants: sharing first, then alphabetically
  const sortedParticipants = [...participants].sort((a, b) => {
    const aSharing = !!activeLocations[a.name];
    const bSharing = !!activeLocations[b.name];
    if (aSharing && !bSharing) return -1;
    if (!aSharing && bSharing) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Location Sharing</h1>
      <p className="page-subtitle">View which participants have shared their location</p>

      <div className="paper-card" style={{ padding: 20, marginBottom: 16, textAlign: 'center', color: 'var(--ink-faded)' }}>
        <MapPin size={40} style={{ margin: '0 auto 8px', color: 'var(--kraft)' }} />
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem' }}>
          Location sharing is opt-in and time-boxed
        </p>
        <p style={{ fontSize: '0.75rem', marginTop: 4 }}>
          Students can share for 15 min, 30 min, 1 hour, or until manually turned off
        </p>
      </div>

      <div className="section-divider">
        <span className="section-divider__line" />
        <span className="section-divider__label">Participant Status</span>
        <span className="section-divider__line" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sortedParticipants.map((p) => {
          const isSharing = !!activeLocations[p.name];
          const loc = activeLocations[p.name];
          return (
            <div key={p.id} className="paper-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--kraft-dark)' }}>
                <User size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--ink-faded)', marginLeft: 8 }}>Group {p.group}</span>
                {isSharing && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-blue)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Navigation size={10} /> 
                    <a href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`} target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>
                      View on Map
                    </a>
                  </div>
                )}
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 2,
                background: isSharing ? 'rgba(107, 127, 94, 0.15)' : 'var(--cream-dark)',
                color: isSharing ? 'var(--olive)' : 'var(--ink-faded)',
              }}>
                {isSharing ? 'Sharing' : 'Not sharing'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
