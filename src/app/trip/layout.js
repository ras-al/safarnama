'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Train, Building2, MapPin } from 'lucide-react';
import styles from './trip.module.css';

const tabs = [
  { href: '/trip', label: 'Itinerary', icon: CalendarDays },
  { href: '/trip/transport', label: 'Transport', icon: Train },
  { href: '/trip/hotels', label: 'Hotels', icon: Building2 },
  { href: '/trip/places', label: 'Places', icon: MapPin },
];

export default function TripLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="page-container">
      <h1 className="page-title">Trip Details</h1>
      <p className="page-subtitle">Everything about your journey</p>

      <nav className={styles.tabNav}>
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/trip' ? pathname === '/trip' : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
