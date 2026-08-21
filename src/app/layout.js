import { Caveat, Lora, Inter } from 'next/font/google';
import './globals.css';
import { AppDataProvider } from '@/lib/DataProvider';
import BottomNav from '@/components/BottomNav';
import SOSButton from '@/components/SOSButton';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import IdentityManager from '@/components/IdentityManager';
import InstallPrompt from '@/components/InstallPrompt';

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://safarnama-iv.vercel.app'),
  title: 'Safarnama - Department of CSE TKMCE',
  description: 'Industrial Visit 2026 - Trip management, itinerary, transport, and coordination app for students',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Safarnama - Department of CSE TKMCE',
    description: 'Industrial Visit 2026 - Trip management, itinerary, transport, and coordination app for students',
    url: 'https://safarnama-iv.vercel.app',
    siteName: 'Safarnama',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Safarnama Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Safarnama',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#C4654A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${caveat.variable} ${lora.variable} ${inter.variable}`}>
      <body>
        <ServiceWorkerRegister />
        <AppDataProvider>
          <IdentityManager>
            <InstallPrompt />
            <SOSButton />
            {children}
            <BottomNav />
          </IdentityManager>
        </AppDataProvider>
      </body>
    </html>
  );
}
