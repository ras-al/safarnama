'use client';
import { useAppData } from '@/lib/DataProvider';
import { FileText, Upload, Trash2 } from 'lucide-react';

export default function AdminDocuments() {
  const { documents } = useAppData();
  
  // Show all documents, or just official ones. 
  // Let's show official ones since tickets are managed via seed.
  const docs = (documents || []).filter(d => d.category === 'official');

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">{docs.length} documents uploaded</p>
        </div>
        <button className="btn btn--primary"><Upload size={15} /> Upload</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {docs.map((doc, i) => (
          <div key={doc.id || i} className="paper-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'var(--cream-dark)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-blue)' }}>
              <FileText size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {doc.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--ink-faded)' }}>
                {doc.type} · {new Date(doc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ fontSize: '0.7rem', padding: '6px', color: 'var(--stamp-red)', border: '1px solid var(--stamp-red)', borderRadius: 4, background: 'var(--cream-dark)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
