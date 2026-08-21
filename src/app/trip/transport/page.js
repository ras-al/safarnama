'use client';
import { useAppData } from '@/lib/DataProvider';
import { Train, Bus, Plane, Navigation, Clock, Copy } from 'lucide-react';
import styles from './transport.module.css';

const typeIcon = { train: Train, bus: Bus, flight: Plane };

export default function TransportPage() {
  const { transport } = useAppData();

  const copyPNR = (pnr) => {
    navigator.clipboard?.writeText(pnr);
  };

  return (
    <div>
      <div className={styles.list}>
        {transport.map((t) => {
          const Icon = typeIcon[t.type] || Train;
          return (
            <div key={t.id} className="ticket-stub" style={{ marginBottom: 16 }}>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.typeBadge}>
                  <Icon size={15} />
                  <span className="stamp stamp--blue">{t.type}</span>
                </div>
                <span className={styles.number}>#{t.number}</span>
              </div>

              <h3 className={styles.name}>{t.name}</h3>

              {/* Route */}
              <div className={styles.route}>
                <div className={styles.station}>
                  <span className={styles.stationName}>{t.from}</span>
                  <span className={styles.stationTime}>{t.departure}</span>
                  <span className={styles.stationDate}>
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div className={styles.arrow}>
                  <span className={styles.dots} />
                  <Navigation size={14} />
                  <span className={styles.dots} />
                </div>
                <div className={styles.station} style={{ textAlign: 'right' }}>
                  <span className={styles.stationName}>{t.to}</span>
                  <span className={styles.stationTime}>{t.arrival}</span>
                  {t.arrivalDate && (
                    <span className={styles.stationDate}>
                      {new Date(t.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Link to Tickets */}
              <div style={{ marginTop: 16 }}>
                <a href="/tickets" className="btn btn--secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  View Train Tickets
                </a>
              </div>

              {t.notes && (
                <p className={styles.notes}>{t.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
