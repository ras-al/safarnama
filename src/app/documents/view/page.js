'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { Suspense } from 'react';

function PdfViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const url = searchParams.get('url');
  const name = searchParams.get('name') || 'Document';

  if (!url) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 100 }}>
        <p>No document selected</p>
        <button className="btn btn--primary" onClick={() => router.back()} style={{ marginTop: 20 }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#e5e5e5' }}>
      <header style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #ddd' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, fontFamily: 'var(--font-serif)' }}>{name}</h2>
        </div>
        <a href={url} download className="btn btn--primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <Download size={14} /> Download
        </a>
      </header>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe 
          src={`${url}#toolbar=0`} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={name}
        />
      </div>
    </div>
  );
}

export default function DocumentViewPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ textAlign: 'center', paddingTop: 100 }}>Loading document...</div>}>
      <PdfViewer />
    </Suspense>
  );
}
