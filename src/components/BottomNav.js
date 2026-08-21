'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Map, MapPin, Ticket, Bell } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/trip', label: 'Trip', icon: Map },
  { href: '/location', label: 'Location', icon: MapPin },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/announcements', label: 'Updates', icon: Bell },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="bottom-nav__icon" strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
