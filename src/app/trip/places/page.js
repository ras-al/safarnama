'use client';
import { useAppData } from '@/lib/DataProvider';
import { Star, Clock, MapPin, Navigation } from 'lucide-react';
import styles from './places.module.css';

export default function PlacesPage() {
  const { places } = useAppData();

  return (
    <div className={styles.list}>
      {places.map((place, idx) => (
        <div
          key={place.id}
          className={`paper-card ${styles.card} ${idx % 3 === 0 ? 'paper-card--rotated' : ''}`}
        >
          {place.mustVisit && (
            <div className={styles.mustVisit}>
              <Star size={12} fill="var(--mustard)" />
              <span>Must Visit</span>
            </div>
          )}

          <h3 className={styles.placeName}>{place.name}</h3>
          <span className={styles.city}>{place.city}</span>

          <p className={styles.desc}>{place.description}</p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Clock size={12} />
              <span>{place.hours}</span>
            </div>
            <div className={styles.metaItem}>
              <MapPin size={12} />
              <span>{place.duration}</span>
            </div>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(place.name + ' ' + place.city)}`}
            target="_blank"
            rel="noopener"
            className="btn btn--secondary"
            style={{ width: '100%', fontSize: '0.75rem', padding: '8px', marginTop: 10 }}
          >
            <Navigation size={13} /> Navigate
          </a>
        </div>
      ))}
    </div>
  );
}
