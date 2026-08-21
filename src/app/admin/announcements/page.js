'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import { Send, Bell, Edit, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import styles from './ann.module.css';

export default function AdminAnnouncements() {
  const { announcements } = useAppData();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('normal');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'announcements', editingId), {
          title,
          body,
          priority
        });
      } else {
        await addDoc(collection(db, 'announcements'), {
          title,
          body,
          priority,
          time: new Date().toISOString(),
          author: 'Coordinator'
        });
      }
      setTitle('');
      setBody('');
      setPriority('normal');
      setEditingId(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleEdit = (ann) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setBody(ann.body);
    setPriority(ann.priority);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteDoc(doc(db, 'announcements', id));
        if (editingId === id) {
          setTitle('');
          setBody('');
          setPriority('normal');
          setEditingId(null);
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Announcements</h1>
      <p className="page-subtitle">Send updates to all participants instantly</p>

      {/* New/Edit Announcement Form */}
      <form onSubmit={handleSubmit} className={`paper-card ${styles.form}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 className={styles.formTitle}>{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setTitle('');
              setBody('');
              setPriority('normal');
            }} style={{ fontSize: '0.7rem', color: 'var(--ink-faded)', textDecoration: 'underline' }}>
              Cancel Edit
            </button>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule Change Tomorrow"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your announcement here..."
            className={styles.textarea}
            rows={4}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={styles.input}>
            <option value="normal">Normal</option>
            <option value="important">Important</option>
          </select>
        </div>

        <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
          {editingId ? 'Update Announcement' : <><Send size={15} /> Send to All Participants</>}
        </button>
      </form>

      {/* Past Announcements */}
      <div className="section-divider" style={{ marginTop: 24 }}>
        <span className="section-divider__line" />
        <span className="section-divider__label">Past Announcements</span>
        <span className="section-divider__line" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...announcements].reverse().map(ann => (
          <div key={ann.id} className={`paper-card ${styles.pastCard}`}>
            <div className="flex-between">
              <span className={`stamp ${ann.priority === 'important' ? '' : 'stamp--olive'}`} style={{ transform: 'none' }}>
                {ann.priority}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--ink-faded)' }}>
                  {new Date(ann.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                <button onClick={() => handleEdit(ann)} style={{ color: 'var(--ink-blue)', padding: 4 }}>
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(ann.id)} style={{ color: 'var(--stamp-red)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h4 style={{ fontFamily: 'var(--font-serif)', marginTop: 8 }}>{ann.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-faded)', marginTop: 4, whiteSpace: 'pre-wrap' }}>{ann.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
