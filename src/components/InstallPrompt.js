'use client';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '16px',
      right: '16px',
      zIndex: 9999,
      background: 'var(--cream-dark)',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px var(--paper-shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: '50%', 
        overflow: 'hidden',
        border: '2px solid var(--paper-white)',
        flexShrink: 0
      }}>
        <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink-dark)' }}>Install Safarnama</h4>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ink-faded)' }}>Add to home screen for offline access</p>
      </div>

      <button 
        className="btn btn--primary" 
        style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        onClick={handleInstallClick}
      >
        <Download size={14} /> Install
      </button>

      <button 
        style={{ position: 'absolute', top: 4, right: 4, background: 'none', border: 'none', color: 'var(--ink-faded)', padding: 4 }}
        onClick={() => setShowPrompt(false)}
      >
        ×
      </button>
    </div>
  );
}
