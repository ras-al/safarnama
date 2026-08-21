'use client';
import { useAppData } from '@/lib/DataProvider';
import { Phone, Plus } from 'lucide-react';

export default function AdminEmergency() {
  const { emergency } = useAppData();
  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div><h1 className="page-title">Emergency Contacts</h1><p className="page-subtitle">Manage emergency contact information</p></div>
        <button className="btn btn--primary"><Plus size={15} /> Add Contact</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[emergency.tripCoordinator, ...emergency.faculty, emergency.studentCoordinator].map((c, i) => (
          <div key={i} className="paper-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-faded)' }}>{c.role} · {c.phone}</div>
            </div>
            <button className="btn btn--secondary" style={{ fontSize: '0.72rem', padding: '6px 10px' }}>Edit</button>
          </div>
        ))}

        <div className="section-divider" style={{ marginTop: 16 }}>
          <span className="section-divider__line" />
          <span className="section-divider__label">Hospitals</span>
          <span className="section-divider__line" />
        </div>

        {emergency.nearbyHospitals.map((h, i) => (
          <div key={i} className="paper-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.9rem' }}>{h.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-blue)' }}>{h.phone}</div>
            </div>
            <button className="btn btn--secondary" style={{ fontSize: '0.72rem', padding: '6px 10px' }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
