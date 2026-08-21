'use client';
import { useAppData } from '@/lib/DataProvider';
import { Phone, MapPin, Shield, Heart, User, Train } from 'lucide-react';
import styles from './emergency.module.css';

export default function EmergencyPage() {
  const { emergency } = useAppData();

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://maps.google.com/?q=${latitude},${longitude}`;
        if (navigator.share) {
          navigator.share({ title: 'My Location', url });
        } else {
          navigator.clipboard?.writeText(url);
          alert('Location link copied!');
        }
      });
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title" style={{ color: 'var(--stamp-red)' }}>Emergency Center</h1>
      <p className="page-subtitle">Quick access to all emergency contacts</p>

      {/* SOS Action */}
      <button onClick={shareLocation} className={`btn btn--sos ${styles.sosBtn}`}>
        <Shield size={18} /> Share My Location Now
      </button>

      {/* Trip Coordinator */}
      <div className="section-divider">
        <span className="section-divider__line" />
        <span className="section-divider__label">Trip Coordinator</span>
        <span className="section-divider__line" />
      </div>

      <a href={`tel:${emergency.tripCoordinator.phone}`} className={`paper-card ${styles.contactCard}`}>
        <div className={styles.contactIcon} style={{ background: 'var(--terracotta)' }}>
          <User size={18} color="white" />
        </div>
        <div>
          <h3 className={styles.contactName}>{emergency.tripCoordinator.name}</h3>
          <p className={styles.contactRole}>{emergency.tripCoordinator.role}</p>
          <p className={styles.contactPhone}>{emergency.tripCoordinator.phone}</p>
        </div>
        <Phone size={18} className={styles.phoneIcon} />
      </a>

      {/* Faculty */}
      <div className="section-divider">
        <span className="section-divider__line" />
        <span className="section-divider__label">Faculty</span>
        <span className="section-divider__line" />
      </div>

      {emergency.faculty.map((f, i) => (
        <a key={i} href={`tel:${f.phone}`} className={`paper-card ${styles.contactCard}`} style={{ marginBottom: 10 }}>
          <div className={styles.contactIcon} style={{ background: 'var(--ink-blue)' }}>
            <User size={18} color="white" />
          </div>
          <div>
            <h3 className={styles.contactName}>{f.name}</h3>
            <p className={styles.contactRole}>{f.role}</p>
            <p className={styles.contactPhone}>{f.phone}</p>
          </div>
          <Phone size={18} className={styles.phoneIcon} />
        </a>
      ))}

      {/* Student Coordinator */}
      <a href={`tel:${emergency.studentCoordinator.phone}`} className={`paper-card ${styles.contactCard}`} style={{ marginTop: 10 }}>
        <div className={styles.contactIcon} style={{ background: 'var(--olive)' }}>
          <User size={18} color="white" />
        </div>
        <div>
          <h3 className={styles.contactName}>{emergency.studentCoordinator.name}</h3>
          <p className={styles.contactRole}>{emergency.studentCoordinator.role}</p>
          <p className={styles.contactPhone}>{emergency.studentCoordinator.phone}</p>
        </div>
        <Phone size={18} className={styles.phoneIcon} />
      </a>

      {/* Emergency Numbers */}
      <div className="section-divider">
        <span className="section-divider__line" />
        <span className="section-divider__label">Emergency Numbers</span>
        <span className="section-divider__line" />
      </div>

      <div className={styles.emergencyGrid}>
        <a href="tel:100" className={styles.emergencyBtn}>
          <Shield size={18} />
          <span className={styles.emergencyNumber}>100</span>
          <span className={styles.emergencyLabel}>Police</span>
        </a>
        <a href="tel:108" className={styles.emergencyBtn}>
          <Heart size={18} />
          <span className={styles.emergencyNumber}>108</span>
          <span className={styles.emergencyLabel}>Ambulance</span>
        </a>
        <a href="tel:139" className={styles.emergencyBtn}>
          <Train size={18} />
          <span className={styles.emergencyNumber}>139</span>
          <span className={styles.emergencyLabel}>Railway</span>
        </a>
      </div>

      {/* Nearby Hospitals */}
      <div className="section-divider">
        <span className="section-divider__line" />
        <span className="section-divider__label">Nearby Hospitals</span>
        <span className="section-divider__line" />
      </div>

      {emergency.nearbyHospitals.map((h, i) => (
        <a key={i} href={`tel:${h.phone}`} className={`paper-card ${styles.contactCard}`} style={{ marginBottom: 10 }}>
          <div className={styles.contactIcon} style={{ background: 'var(--stamp-red)' }}>
            <Heart size={18} color="white" />
          </div>
          <div>
            <h3 className={styles.contactName}>{h.name}</h3>
            <p className={styles.contactPhone}>{h.phone}</p>
          </div>
          <Phone size={18} className={styles.phoneIcon} />
        </a>
      ))}
    </div>
  );
}
