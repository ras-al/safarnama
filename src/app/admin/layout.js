'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Train, Building2, MapPin,
  Users, Bell, Shield, FileText, Camera, Map
} from 'lucide-react';
import styles from './admin.module.css';

const sidebarItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/itinerary', label: 'Itinerary', icon: CalendarDays },
  { href: '/admin/transport', label: 'Transport', icon: Train },
  { href: '/admin/hotels', label: 'Hotels', icon: Building2 },
  { href: '/admin/places', label: 'Places', icon: MapPin },
  { href: '/admin/participants', label: 'Participants', icon: Users },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/emergency', label: 'Emergency', icon: Shield },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/photos', label: 'Photos', icon: Camera },
  { href: '/admin/location', label: 'Location', icon: Map },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2 className={styles.brandTitle}>Safarnama</h2>
          <span className={styles.brandSub}>Admin Panel</span>
        </div>

        <nav className={styles.nav}>
          {sidebarItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <Link href="/" className={styles.backLink}>
          Back to Student App
        </Link>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
