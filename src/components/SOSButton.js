'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function SOSButton() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname === '/emergency') return null;

  return (
    <Link href="/emergency" className="sos-fab" aria-label="Emergency SOS">
      SOS
    </Link>
  );
}
