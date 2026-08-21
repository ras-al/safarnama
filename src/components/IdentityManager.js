'use client';
import { useState, useEffect } from 'react';
import { useAppData } from '@/lib/DataProvider';

export default function IdentityManager({ children }) {
  const { participants } = useAppData();
  const [identity, setIdentity] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('safarnama_identity');
    if (saved) {
      setIdentity(saved);
    }
    setIsLoaded(true);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (!selectedName) return;
    localStorage.setItem('safarnama_identity', selectedName);
    setIdentity(selectedName);
  };

  if (!isLoaded) return null;

  // Render normal app if splash is done and identity exists
  if (!showSplash && identity) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--cream)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      <style jsx>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      <div style={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        overflow: 'hidden',
        marginBottom: 24,
        boxShadow: '2px 4px 12px var(--paper-shadow)',
        border: '4px solid var(--paper-white)',
        animation: 'popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }}>
        <img src="/logo.png" alt="Safarnama Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <h1 className="heading-handwritten" style={{ fontSize: '3rem', marginBottom: 8, color: 'var(--terracotta)', animation: 'fadeUp 0.8s ease forwards 0.3s', opacity: 0 }}>Safarnama</h1>
      <p className="heading-serif" style={{ fontSize: '1.2rem', marginBottom: 32, color: 'var(--ink-dark)', animation: 'fadeUp 0.8s ease forwards 0.5s', opacity: 0 }}>Department of CSE TKMCE</p>

      {/* Only show the selection box if the splash is done AND there is no identity */}
      {!showSplash && !identity && (
        <div className="paper-card" style={{ width: '100%', maxWidth: 320, animation: 'fadeUp 0.5s ease forwards' }}>
          <p style={{ marginBottom: 16, fontSize: '0.9rem', color: 'var(--ink-faded)' }}>Welcome aboard! Please select your name to continue.</p>
          <select 
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid var(--kraft)',
              background: 'var(--cream)',
              marginBottom: 16,
              fontSize: '1rem'
            }}
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
          >
            <option value="">Select your name...</option>
            {participants?.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          
          <button 
            className="btn btn--primary" 
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            onClick={handleSave}
            disabled={!selectedName}
          >
            Let's Go!
          </button>
        </div>
      )}
    </div>
  );
}
