'use client';
import { useAppData } from '@/lib/DataProvider';
import {
  Users, CalendarDays, Train, Building2, MapPin, Bell,
  FileText, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const data = useAppData();

  const stats = [
    { label: 'Participants', value: data.participants?.length || 0, icon: Users, color: 'var(--terracotta)', href: '/admin/participants' },
    { label: 'Itinerary Days', value: data.itinerary?.length || 0, icon: CalendarDays, color: 'var(--olive)', href: '/admin/itinerary' },
    { label: 'Transport Legs', value: data.transport?.length || 0, icon: Train, color: 'var(--ink-blue)', href: '/admin/transport' },
    { label: 'Hotels', value: data.hotels?.length || 0, icon: Building2, color: 'var(--mustard)', href: '/admin/hotels' },
    { label: 'Places', value: data.places?.length || 0, icon: MapPin, color: 'var(--terracotta-light)', href: '/admin/places' },
    { label: 'Announcements', value: data.announcements?.length || 0, icon: Bell, color: 'var(--olive-light)', href: '/admin/announcements' },
  ];

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Manage all trip data from here</p>

      <div className={styles.statsGrid}>
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color }}>
              <Icon size={22} />
            </div>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
          </Link>
        ))}
      </div>

      <div className="section-divider" style={{ marginTop: 32 }}>
        <span className="section-divider__line" />
        <span className="section-divider__label">Quick Actions</span>
        <span className="section-divider__line" />
      </div>

      <div className={styles.actionsGrid}>
        <Link href="/admin/announcements" className={`btn btn--primary ${styles.actionBtn}`}>
          <Bell size={15} /> New Announcement
        </Link>
        <Link href="/admin/itinerary" className={`btn btn--secondary ${styles.actionBtn}`}>
          <CalendarDays size={15} /> Edit Itinerary
        </Link>
        <Link href="/admin/participants" className={`btn btn--secondary ${styles.actionBtn}`}>
          <Users size={15} /> Manage Participants
        </Link>
      </div>

      {/* Trip Info */}
      <div className={`paper-card ${styles.tripInfo}`}>
        <h3 className={styles.tripInfoTitle}>Trip Overview</h3>
        <div className={styles.tripInfoGrid}>
          <div><span className={styles.infoLabel}>Trip</span><span className={styles.infoValue}>{data.trip?.name}</span></div>
          <div><span className={styles.infoLabel}>Duration</span><span className={styles.infoValue}>{data.trip?.totalDays} days</span></div>
          <div><span className={styles.infoLabel}>Start</span><span className={styles.infoValue}>{data.trip?.startDate}</span></div>
          <div><span className={styles.infoLabel}>End</span><span className={styles.infoValue}>{data.trip?.endDate}</span></div>
          <div><span className={styles.infoLabel}>Current Day</span><span className={styles.infoValue}>Day {data.trip?.currentDay}</span></div>
          <div><span className={styles.infoLabel}>Participants</span><span className={styles.infoValue}>{data.participants?.length || data.trip?.totalParticipants}</span></div>
        </div>
      </div>
    </div>
  );
}
