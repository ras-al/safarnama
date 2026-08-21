'use client';
import { useAppData } from '@/lib/DataProvider';
import { Bell, AlertTriangle } from 'lucide-react';
import styles from './announcements.module.css';

export default function AnnouncementsPage() {
  const { announcements } = useAppData();

  return (
    <div className="page-container">
      <h1 className="page-title">Announcements</h1>
      <p className="page-subtitle">Updates from the trip coordinator</p>

      <div className={styles.list}>
        {[...announcements].reverse().map((ann) => (
          <div key={ann.id} className={`paper-card paper-card--tape ${styles.card}`}>
            <div className={styles.header}>
              <span className={`stamp ${ann.priority === 'important' ? '' : 'stamp--olive'}`}>
                {ann.priority === 'important' ? (
                  <><AlertTriangle size={10} /> Important</>
                ) : (
                  <><Bell size={10} /> Notice</>
                )}
              </span>
              <span className={styles.time}>
                {new Date(ann.time).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>

            <h3 className={styles.title}>{ann.title}</h3>
            <p className={styles.body}>{ann.body}</p>
            <p className={styles.author}>- {ann.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
