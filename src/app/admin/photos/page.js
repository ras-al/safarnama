'use client';
import { Camera, Image as ImageIcon } from 'lucide-react';

export default function AdminPhotos() {
  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div><h1 className="page-title">Trip Photos</h1><p className="page-subtitle">Manage photos uploaded by participants</p></div>
        <button className="btn btn--primary"><Camera size={15} /> Upload Photos</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="polaroid" style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 1.5}deg)` }}>
            <div style={{
              aspectRatio: '4/3',
              background: 'var(--cream-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--kraft-dark)',
              border: '1px dashed var(--kraft)'
            }}>
              <ImageIcon size={28} />
            </div>
            <span className="polaroid__caption">Photo {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
