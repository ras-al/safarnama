'use client';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e5e5e5' }}>Loading Map...</div>
});

export default function MapWrapper(props) {
  return <DynamicMap {...props} />;
}
