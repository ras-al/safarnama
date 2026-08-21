'use client';
import { useAppData } from '@/lib/DataProvider';
import { FileText, Download, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import styles from './documents.module.css';

export default function DocumentsPage() {
  const { documents, downloadForOffline, downloadProgress, isOfflineReady } = useAppData();

  const officialDocs = (documents || []).filter(d => d.category === 'official');

  return (
    <div className="page-container">
      <h1 className="page-title">Documents</h1>
      <p className="page-subtitle">Official trip documents</p>

      <button
        className={`btn btn--primary ${styles.downloadAll}`}
        onClick={downloadForOffline}
        disabled={downloadProgress === 'downloading'}
      >
        {downloadProgress === 'downloading' ? 'Downloading...' : downloadProgress === 'complete' ? <><CheckCircle size={15}/> Saved Offline</> : <><Download size={15} /> {isOfflineReady ? 'Update Offline Data' : 'Download All for Offline'}</>}
      </button>

      <div className={styles.list}>
        {officialDocs.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`paper-card ${styles.docCard}`}
          >
            <div className={styles.docIcon}>
              <FileText size={22} color="var(--terracotta)" />
            </div>
            <div className={styles.docInfo}>
              <h3 className={styles.docName}>{doc.name}</h3>
              <span className={styles.docType}>{doc.type}</span>
            </div>
            <ExternalLink size={16} className={styles.docAction} />
          </a>
        ))}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--ink-faded)', textAlign: 'center', marginTop: 20 }}>
        Train tickets are available in the Tickets tab
      </p>
    </div>
  );
}
