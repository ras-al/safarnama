'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import { Phone, User, Search, Train, DoorOpen, MapPin } from 'lucide-react';
import styles from './participants.module.css';

export default function ParticipantsPage() {
  const { participants } = useAppData();
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [sharing, setSharing] = useState(null);

  const groups = [...new Set(participants.map(p => p.group))].sort();

  const filtered = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = !activeGroup || p.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Participants</h1>
      <p className="page-subtitle">{participants.length} travellers on this trip</p>

      {/* Location Sharing */}
      <div className={`paper-card ${styles.locationShareCard}`}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} color="var(--terracotta)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Share Location</span>
          </div>
          {sharing ? (
            <button onClick={() => setSharing(null)} className="btn btn--secondary" style={{ fontSize: '0.75rem', padding: '6px 12px', color: 'var(--stamp-red)', borderColor: 'var(--stamp-red)' }}>
              Stop Sharing
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setSharing('15m')} className="btn btn--secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>15m</button>
              <button onClick={() => setSharing('1h')} className="btn btn--secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>1h</button>
              <button onClick={() => setSharing('on')} className="btn btn--primary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>On</button>
            </div>
          )}
        </div>
        {sharing && (
          <p style={{ fontSize: '0.7rem', color: 'var(--olive)', marginTop: 8, fontStyle: 'italic' }}>
            ✓ Location shared with group leader and admin ({sharing === 'on' ? 'until turned off' : `for ${sharing}`}).
          </p>
        )}
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Group Tabs */}
      <div className="day-tabs" style={{ marginBottom: 16 }}>
        <button
          className={`day-tab ${!activeGroup ? 'day-tab--active' : ''}`}
          onClick={() => setActiveGroup(null)}
        >
          All
        </button>
        {groups.map(g => (
          <button
            key={g}
            className={`day-tab ${activeGroup === g ? 'day-tab--active' : ''}`}
            onClick={() => setActiveGroup(g)}
          >
            Group {g}
          </button>
        ))}
      </div>

      {/* Participants List */}
      <div className={styles.list}>
        {filtered.map((p) => (
          <div key={p.id} className={`paper-card ${styles.card}`}>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{p.name}</h3>
              <div className={styles.details}>
                <span className={styles.detail}>
                  <span className={styles.detailLabel}>Group</span> {p.group}
                </span>
                <span className={styles.detail}>
                  <DoorOpen size={10} /> {p.room}
                </span>
                <span className={styles.detail}>
                  <Train size={10} /> {p.coach}/{p.seat}
                </span>
              </div>
            </div>
            <a href={`tel:${p.phone}`} className={styles.callBtn}>
              <Phone size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
