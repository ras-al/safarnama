'use client';
import { useAppData } from '@/lib/DataProvider';
import { Phone, MapPin, Wifi, Clock, ChevronRight } from 'lucide-react';
import styles from './hotels.module.css';

export default function HotelsPage() {
  const { hotels } = useAppData();

  return (
    <div className={styles.list}>
      {hotels.map((hotel) => (
        <div key={hotel.id} className={`postcard ${styles.card}`}>
          {/* Postcard Header */}
          <div className={styles.cardHeader}>
            <div className={styles.cityStamp}>
              <span className="stamp stamp--olive">{hotel.city}</span>
            </div>
            <h3 className={styles.hotelName}>{hotel.name}</h3>
            <p className={styles.address}>
              <MapPin size={12} />
              {hotel.address}
            </p>
          </div>

          {/* Details */}
          <div className={styles.cardBody}>
            <div className={styles.timeRow}>
              <div className={styles.timeBlock}>
                <span className={styles.timeLabel}>Check-in</span>
                <span className={styles.timeValue}>
                  {new Date(hotel.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                <span className={styles.timeHour}>
                  {new Date(hotel.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={styles.timeDivider}>
                <Clock size={14} />
              </div>
              <div className={styles.timeBlock} style={{ textAlign: 'right' }}>
                <span className={styles.timeLabel}>Check-out</span>
                <span className={styles.timeValue}>
                  {new Date(hotel.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                <span className={styles.timeHour}>
                  {new Date(hotel.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {hotel.wifi && (
              <div className={styles.wifiRow}>
                <Wifi size={13} />
                <span className={styles.wifiText}>{hotel.wifi}</span>
              </div>
            )}

            {hotel.notes && (
              <p className={styles.notes}>{hotel.notes}</p>
            )}

            <div className={styles.actions}>
              <a 
                href={hotel.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.city)}`}
                target="_blank" 
                rel="noopener" 
                className="btn btn--secondary" 
                style={{ fontSize: '0.75rem', padding: '8px 12px' }}
              >
                <MapPin size={13} /> Navigate
              </a>
              <a href={`tel:${hotel.phone}`} className="btn btn--primary" style={{ fontSize: '0.75rem', padding: '8px 12px' }}>
                <Phone size={13} /> Call Hotel
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
